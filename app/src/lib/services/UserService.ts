import { Database, Organization, User } from "marklie-ts-core";

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

  async setName(
    firstName: string,
    lastName: string,
    user: User,
  ): Promise<void> {
    user.firstName = firstName;
    user.lastName = lastName;
    await database.em.persistAndFlush(user);
  }
}
