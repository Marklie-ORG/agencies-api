import { Database, Organization, User } from "markly-ts-core";

const database = await Database.getInstance();

export class UserService {
  async setActiveOrganization(
    activeOrganizationUuid: string,
    user: User,
  ): Promise<void> {
    user.activeOrganization = database.em.getReference(
      Organization,
      activeOrganizationUuid,
    );
    await database.em.persistAndFlush(user);
  }
}
