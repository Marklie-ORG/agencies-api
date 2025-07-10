import { Database, OrganizationToken, User } from "marklie-ts-core";
import { OrganizationTokenType } from "marklie-ts-core/dist/lib/enums/enums.js";

const database = await Database.getInstance();

export class AgencyService {
  async saveAgencyToken(user: User, token: string): Promise<void> {
    const tokenEntity = new OrganizationToken();
    tokenEntity.type = OrganizationTokenType.FACEBOOK;
    tokenEntity.token = token;
    tokenEntity.organization = user.activeOrganization;

    await database.em.persistAndFlush(tokenEntity);
  }
}
