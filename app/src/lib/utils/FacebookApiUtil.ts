
// Provided interfaces
export interface Root {
    data: Daum[];
    paging: Paging3;
  }
  
  export interface Daum {
    id: string;
    name: string;
    owned_ad_accounts?: OwnedAdAccounts;
    client_ad_accounts?: ClientAdAccounts;
  }
  
  export interface OwnedAdAccounts {
    data: Daum2[];
    paging: Paging;
  }
  
  export interface Daum2 {
    id: string;
    name: string;
    account_status: number;
    currency: string;
    timezone_name: string;
  }
  
  export interface Paging {
    cursors: Cursors;
    next?: string;
  }
  
  export interface Cursors {
    before: string;
    after: string;
  }
  
  export interface ClientAdAccounts {
    data: Daum3[];
    paging: Paging2;
  }
  
  export interface Daum3 {
    id: string;
    name: string;
    account_status: number;
    currency: string;
    timezone_name: string;
  }
  
  export interface Paging2 {
    cursors: Cursors2;
    next?: string;
  }
  
  export interface Cursors2 {
    before: string;
    after: string;
  }
  
  export interface Paging3 {
    cursors: Cursors3;
    next: string;
  }
  
  export interface Cursors3 {
    before: string;
    after: string;
  }
  
  // Define a simplified interface for the account hierarchy
  interface AccountHierarchy {
    id: string;
    name: string;
    owned_ad_accounts: {
      id: string;
      name: string;
    }[];
    client_ad_accounts: {
      id: string;
      name: string;
    }[];
  }

export class FacebookApiUtil {
  // Function to extract names from the Root object into a simplified hierarchy
    public static extractAccountHierarchy(root: Root): AccountHierarchy[] {
        return root.data.map((account) => ({
        id: account.id,
        name: account.name,
        owned_ad_accounts: account.owned_ad_accounts
            ? account.owned_ad_accounts.data.map((owned) => ({
                id: owned.id,
                name: owned.name,
            }))
            : [],
        client_ad_accounts: account.client_ad_accounts
            ? account.client_ad_accounts.data.map((client) => ({
                id: client.id,
                name: client.name,
            }))
            : [],
        }));
    }
}


