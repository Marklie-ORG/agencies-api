import type {
  AccountHierarchy,
  Root,
} from "marklie-ts-core/dist/lib/interfaces/FacebookInterfaces.js";

export async function extractAccountHierarchy(
  root: Root,
): Promise<AccountHierarchy[]> {
  return root.data
    .map((account) => ({
      id: account.id,
      name: account.name,
      ad_accounts: [
        ...(account.owned_ad_accounts?.data || []),
        ...(account.client_ad_accounts?.data || []),
      ]
        .map((account) => ({
          id: account.id,
          name: account.name,
          business: account.business
            ? {
                id: account.business.id,
                name: account.business.name,
              }
            : null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
