import axios, { type AxiosInstance } from "axios";

export class FacebookApi {
  private api: AxiosInstance;
  private readonly FACEBOOK_ACCESS_TOKEN: string;

  constructor(private organizationName: string) {
    this.FACEBOOK_ACCESS_TOKEN =
      this.getOrganizationAccessToken(organizationName);
    this.api = axios.create({
      baseURL: "https://graph.facebook.com/v22.0",
      headers: { "Content-Type": "application/json" },
    });
    this.api.interceptors.request.use((config) => {
      config.params = {
        ...config.params,
        access_token: this.FACEBOOK_ACCESS_TOKEN,
      };
      return config;
    });
  }

  private getOrganizationAccessToken(organizationName: string): string {
    switch (organizationName) {
      case "test":
        return process.env.FACEBOOK_ACCESS_TOKEN as string;
      default:
        throw new Error("Invalid organization");
    }
  }

  public async getMe(): Promise<{id: string, name: string}> {
    try {
      const response = await this.api.get<{id: string, name: string}>(`/me`, {
        params: {
          fields: "id,name",
          access_token: this.FACEBOOK_ACCESS_TOKEN
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getBusinesses() {
    try {
      const response = await this.api.get(`/me/businesses`, {
        params: {
          fields: "id,name,owned_ad_accounts{id,name,account_status},client_ad_accounts{id,name,account_status}",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

}
