import { Database, OrganizationToken, User } from "markly-ts-core";
import { OrganizationTokenType } from "markly-ts-core/dist/lib/enums/enums.js";

const database = await Database.getInstance();

export class AgencyService {
  
    async saveAgencyToken(user: User, token: string): Promise<void> {
        try {
          const tokenEntity = new OrganizationToken();
          tokenEntity.type = OrganizationTokenType.FACEBOOK;
          tokenEntity.token = token;
          tokenEntity.organization = user.activeOrganization;
    
          await database.em.persistAndFlush(tokenEntity);
        } catch (e) {
        //   logger.error(e);
        }
    }

}
