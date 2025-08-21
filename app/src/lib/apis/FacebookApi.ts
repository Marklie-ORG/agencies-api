import axios, { AxiosError, type AxiosInstance } from "axios";
import {
  Database,
  Log,
  MarklieError,
  OrganizationToken,
  ReportsConfigService,
} from "marklie-ts-core";

const database = await Database.getInstance();
const logger = Log.getInstance().extend("facebook-api");
const config = ReportsConfigService.getInstance();

export class FacebookApi {
  private api: AxiosInstance;

  constructor(token?: string) {
    this.api = axios.create({
      baseURL: config.getFacebookApiUrl(),
      params: { access_token: token },
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
        const fbError = error.response?.data as any;
        const fbCode = fbError?.error?.code;
        const fbMessage = fbError?.error?.message || "";

        logger.error("Facebook API Error:", {
          status: error.response?.status,
          fbCode,
          fbMessage,
          url: error.config?.url,
        });

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

  public async getBusinesses() {
    const response = await this.api.get(`/me/businesses`, {
      params: {
        fields:
          "id,name,owned_ad_accounts{id,name,account_status,business},client_ad_accounts{id,name,account_status,business}",
      },
    });

    return response.data;
  }

  public async getAdAccounts() {
    const response = await this.api.get(`/me/adaccounts`, {
      params: {
        fields: "id,name,account_status,currency,timezone_name",
        limit: 500,
      },
    });

    return response.data;
  }

  public async getAdAccountCurrency(adAccountId: string) {
    const res = await this.api.get(`${adAccountId}`, {
      params: { fields: "currency" },
    });
    return res.data;
  }
}
