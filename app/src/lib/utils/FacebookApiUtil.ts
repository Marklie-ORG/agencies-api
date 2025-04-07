import type {
  AccountHierarchy,
  Root,
} from "../interfaces/FacebookInterfaces.js";

export class FacebookApiUtil {
  public static extractAccountHierarchy(root: Root): AccountHierarchy[] {
    return root.data
      .map((account) => ({
        id: account.id,
        name: account.name,
        owned_ad_accounts: account.owned_ad_accounts
          ? account.owned_ad_accounts.data
              .map((owned) => ({
                id: owned.id,
                name: owned.name,
              }))
              .sort((a, b) => a.name.localeCompare(b.name))
          : [],
        client_ad_accounts: account.client_ad_accounts
          ? account.client_ad_accounts.data
              .map((client) => ({
                id: client.id,
                name: client.name,
              }))
              .sort((a, b) => a.name.localeCompare(b.name))
          : [],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
