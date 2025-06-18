import axios, { type AxiosInstance } from "axios";

export class FacebookApi {
  private api: AxiosInstance;
  private accessToken: string;

  constructor(accessToken?: string) {
    this.api = axios.create({
      baseURL: `https://graph.facebook.com/v22.0`,
      headers: { "Content-Type": "application/json" },
    });
    this.accessToken = accessToken || "";
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
        access_token: this.accessToken,
      },
    });

    return response.data;
  }

  public async getAdAccounts() {
    const response = await this.api.get(`/me/adaccounts`, {
      params: {
        fields: "id,name,account_status,currency,timezone_name",
        limit: 500,
        access_token: this.accessToken,
      },
    });

    return response.data;
  }
}
