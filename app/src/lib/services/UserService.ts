import { User } from "../entities/User.js";
import { em } from "../db/config/DB.js";
import { Organization } from "../entities/Organization.js";

export class UserService {
  async setActiveOrganization(
    activeOrganizationUuid: string,
    user: User,
  ): Promise<void> {
    user.activeOrganization = em.getReference(
      Organization,
      activeOrganizationUuid,
    );
    await em.persistAndFlush(user);
  }
}
