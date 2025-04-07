import axios, { type AxiosInstance } from "axios";
import { OrganizationTokenType } from "../enums/enums.js";
import { OrganizationToken } from "../entities/OrganizationToken.js";
import { em } from "../db/config/DB.js";

export class FacebookApi {
  private constructor(private api: AxiosInstance) {}

  public static async create(
    organizationUuid: string,
    accountId: string,
  ): Promise<FacebookApi> {
    const tokenRecord = await em.findOne(OrganizationToken, {
      organization: organizationUuid,
      type: OrganizationTokenType.FACEBOOK,
    });

    if (!tokenRecord) {
      throw new Error(
        `Access token not found for organization ${organizationUuid}`,
      );
    }

    const api = axios.create({
      baseURL: `https://graph.facebook.com/v22.0/${accountId}`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        access_token: tokenRecord.token,
      },
    });

    return new FacebookApi(api);
  }

  public async getMe(): Promise<{ id: string; name: string }> {
    const response = await this.api.get("/me", {
      params: {
        fields: "id,name",
      },
    });

    return response.data;
  }

  public async getBusinesses() {
    const response = await this.api.get(`/me/businesses`, {
      params: {
        fields:
          "id,name,owned_ad_accounts{id,name,account_status},client_ad_accounts{id,name,account_status}",
      },
    });

    return response.data;
  }
}
