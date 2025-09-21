import { FacebookApi } from "lib/apis/FacebookApi.js";
import { extractAccountHierarchy } from "lib/utils/FacebookDataUtil.js";
import {
  Database,
  ErrorCode,
  MarklieError,
  OrganizationToken,
} from "marklie-ts-core";

export class AdAccountsService {
  async getAvailableAdAccounts(
    organizationUuid: string | undefined,
  ): Promise<any> {
    if (!organizationUuid) {
      throw new Error("No organization Uuid");
    }

    const database = await Database.getInstance();
    const tokenRecord = await database.em.findOne(OrganizationToken, {
      organization: organizationUuid,
    });

    if (!tokenRecord) {
      throw new Error(
        `No tokenRecord found for organization ${organizationUuid}`,
      );
    }

    const facebookApi = await FacebookApi.create(organizationUuid);

    const [businessesResponse] = await Promise.all([
      facebookApi.getBusinessesCached(organizationUuid),
    ]);

    return extractAccountHierarchy(businessesResponse.data);
  }

  async getAdAccountCurrency(
    adAccountId: string | undefined,
    organizationUuid: string | undefined,
  ): Promise<{ currency: string }> {
    if (!adAccountId || !organizationUuid) {
      throw new MarklieError(
        "No ad account or client uuid provided",
        ErrorCode.BAD_REQUEST,
      );
    }

    const api = await FacebookApi.create(organizationUuid);
    return await api.getAdAccountCurrency(adAccountId);
  }
}
