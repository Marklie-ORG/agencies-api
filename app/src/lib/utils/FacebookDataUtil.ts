export interface AccountHierarchy {
  id: string;
  name: string;
  ad_accounts: Array<{
    id: string;
    name: string;
    account_status?: number | string;
    currency?: string;
    timezone_name?: string;
    business: { id: string; name: string } | null;
  }>;
}

export function extractAccountHierarchy(businesses: any[]): AccountHierarchy[] {
  if (!Array.isArray(businesses)) {
    return [];
  }

  const byName = (a: any, b: any) =>
    (a?.name || "").localeCompare(b?.name || "");
  const uniqById = <T extends { id: string }>(arr: T[]) => {
    const seen = new Set<string>();
    return arr.filter((x) => x?.id && !seen.has(x.id) && seen.add(x.id));
  };

  return businesses
    .map((biz) => {
      const owned = Array.isArray(biz.owned_ad_accounts)
        ? biz.owned_ad_accounts
        : [];
      const client = Array.isArray(biz.client_ad_accounts)
        ? biz.client_ad_accounts
        : [];

      const ad_accounts = uniqById([...owned, ...client])
        .map((acc: any) => ({
          id: acc.id,
          name: acc.name,
          account_status: acc.account_status,
          currency: acc.currency,
          timezone_name: acc.timezone_name,
          business: acc.business
            ? { id: acc.business.id, name: acc.business.name }
            : null,
        }))
        .filter((a) => a.id && a.name)
        .sort(byName);

      return {
        id: biz.id,
        name: biz.name,
        ad_accounts,
      };
    })
    .filter((b) => b.id && b.name) // keep empty businesses if you want; or add `&& b.ad_accounts.length`
    .sort(byName);
}
