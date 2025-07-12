import { FacebookApi } from "lib/apis/FacebookApi.js";
import { extractAccountHierarchy } from "lib/utils/FacebookDataUtil.js";
import { OrganizationToken } from "marklie-ts-core";
import { Database } from "marklie-ts-core";
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

    const facebookApi = new FacebookApi(tokenRecord.token);

    const [businessesResponse, adAccountsResponse] = await Promise.all([
      facebookApi.getBusinesses(),
      facebookApi.getAdAccounts(),
    ]);

    let businessesHierarchy = await extractAccountHierarchy(
      businessesResponse as any,
    );

    const adAccounts = adAccountsResponse.data.map((adAccount: any) => {
      return adAccount.id;
    });

    for (const business of businessesHierarchy) {
      for (let adAccount of (business as any).ad_accounts) {
        if (!adAccounts.includes(adAccount.id)) {
          (business as any).ad_accounts = (business as any).ad_accounts.filter(
            (account: any) => account.id !== adAccount.id,
          );
        }
      }
      if ((business as any).ad_accounts.length === 0) {
        businessesHierarchy = businessesHierarchy.filter(
          (business1: any) => business1.id !== (business as any).id,
        );
      }
    }

    return businessesHierarchy;
  }
}
