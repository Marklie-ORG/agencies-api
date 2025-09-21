import axios, { AxiosError, type AxiosInstance } from "axios";
import {
  Database,
  Log,
  MarklieError,
  OrganizationToken,
  RedisClient,
  ReportsConfigService,
} from "marklie-ts-core";

const database = await Database.getInstance();
const logger = Log.getInstance().extend("facebook-api");
const config = ReportsConfigService.getInstance();

export class FacebookApi {
  private api: AxiosInstance;
  private token: string;

  constructor(token?: string) {
    this.token = token ?? "";
    this.api = axios.create({
      baseURL: config.getFacebookApiUrl(),
      params: { access_token: this.token },
      timeout: 30000,
    });
    this.setupInterceptors();
  }

  static async create(organizationUuid: string): Promise<FacebookApi> {
    const tokenRecord = await database.em.findOne(OrganizationToken, {
      organization: organizationUuid,
    });
    if (!tokenRecord)
      throw new Error(
        `No token found for organizationUuid ${organizationUuid}`,
      );
    return new FacebookApi(tokenRecord.token);
  }

  private setupInterceptors() {
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const status = error.response?.status;
        const fbError = error.response?.data as any;
        const fbCode = fbError?.error?.code;
        const fbMessage = fbError?.error?.message || "";

        logger.error("Facebook API Error:", {
          status,
          fbCode,
          fbMessage,
          url: error.config?.url,
        });

        if (
          status === 429 ||
          (status === 403 && (fbCode === 4 || fbCode === 17)) ||
          (status !== undefined && status >= 500) ||
          fbCode === 613
        ) {
          (error as any).__retryable = true;
        }

        switch (fbCode) {
          case 190:
            throw MarklieError.unauthorized(
              "Facebook access token is invalid",
              "facebook-api",
            );
          case 100:
            throw MarklieError.validation(
              `Facebook API validation error: ${fbMessage}`,
              { fbCode },
            );
          default:
            throw MarklieError.externalApi(
              "Facebook API",
              error,
              "facebook-api",
            );
        }
      },
    );
  }

  // ---------- Core helpers ----------

  private async postFormWithRetry<T = any>(
    url: string,
    form: URLSearchParams,
  ): Promise<T> {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const jitter = () => Math.floor(Math.random() * 250);
    const nextDelay = (i: number, base = 600) =>
      Math.min(30_000, base * 2 ** i) + jitter();
    let attempt = 0;
    while (true) {
      try {
        const res = await this.api.post(url, form, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return res.data as T;
      } catch (err: any) {
        const status = err?.response?.status;
        const fbCode = err?.response?.data?.error?.code;
        const retryable =
          status === 429 ||
          status >= 500 ||
          (status === 403 && (fbCode === 4 || fbCode === 17)) ||
          fbCode === 613;
        if (retryable && attempt < 4) {
          const ra = Number(err?.response?.headers?.["retry-after"]);
          await sleep(ra ? ra * 1000 : nextDelay(attempt++));
          continue;
        }
        throw MarklieError.externalApi("Facebook API", err, "facebook-api");
      }
    }
  }

  private async batch<T = any>(
    ops: Array<{ method?: "GET" | "POST" | "DELETE"; relative_url: string }>,
  ): Promise<T[]> {
    const chunks: (typeof ops)[] = [];
    for (let i = 0; i < ops.length; i += 50) chunks.push(ops.slice(i, i + 50));

    const all: T[] = [];
    for (const chunk of chunks) {
      const form = new URLSearchParams();
      form.append("access_token", this.token);
      form.append("include_headers", "false");
      form.append("batch", JSON.stringify(chunk));

      const res = await this.postFormWithRetry<any[]>("/", form);
      for (const item of res) {
        if (!item || item.code >= 400) {
          const body = item?.body ? JSON.parse(item.body) : {};
          throw MarklieError.externalApi(
            "Facebook API",
            new Error(`Batch item failed: ${JSON.stringify(body)}`),
            "facebook-api",
          );
        }
        all.push(item.body ? JSON.parse(item.body) : null);
      }
    }
    return all;
  }

  public async getBusinessesCached(
    orgUuid: string,
    ttlSeconds = 300,
  ): Promise<{ data: any[] }> {
    const cacheKey = `fb:businesses:${orgUuid}`;
    const cached = await RedisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const businesses = await this.getBusinesses();
    await RedisClient.set(cacheKey, JSON.stringify(businesses), ttlSeconds);
    return businesses;
  }

  public async handleFacebookLogin(code: string, redirectUri: string) {
    let response;

    try {
      response = await this.api.get("/oauth/access_token", {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          redirect_uri: redirectUri,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          code: code,
        },
      });
    } catch (error) {
      console.error(error);
    }

    return response?.data || null;
  }

  public async getBusinesses(): Promise<{ data: any[] }> {
    const res = await this.batch<{ data: any[] }>([
      { method: "GET", relative_url: "/me/businesses?fields=id,name" },
    ]);

    const businesses = res[0]?.data ?? [];
    if (!businesses.length) {
      return { data: [] };
    }

    const hydrateEdge = async (
      edge: "owned_ad_accounts" | "client_ad_accounts",
    ) => {
      const ops = businesses.map((b) => ({
        method: "GET" as const,
        relative_url: `/${b.id}/${edge}?fields=id,name,account_status,currency,timezone_name,business&limit=500`,
      }));
      const results = await this.batch<{ data?: any[] }>(ops);
      results.forEach((r, i) => {
        (businesses[i] as any)[edge] = r?.data ?? [];
      });
    };

    await hydrateEdge("owned_ad_accounts");
    await hydrateEdge("client_ad_accounts");

    return { data: businesses };
  }

  public async getAdAccountsCached(
    orgUuid: string,
    ttlSeconds = 300,
  ): Promise<{ data: any[] }> {
    const cacheKey = `fb:adaccounts:${orgUuid}`;
    const cached = await RedisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const accounts = await this.getAdAccounts();
    await RedisClient.set(cacheKey, JSON.stringify(accounts), ttlSeconds);
    return accounts;
  }

  public async getAdAccounts(): Promise<{ data: any[] }> {
    const res = await this.batch<{ data: any[] }>([
      {
        method: "GET",
        relative_url: "/me/adaccounts?fields=id,name&limit=500",
      },
    ]);
    return { data: res[0]?.data ?? [] };
  }

  public async getAdAccountCurrency(adAccountId: string) {
    const res = await this.batch<{ currency: string }>([
      { method: "GET", relative_url: `/${adAccountId}?fields=currency` },
    ]);
    return res[0];
  }
}
