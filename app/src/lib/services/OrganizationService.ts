import {
  Organization,
  OrganizationInvite,
  OrganizationMember,
  User,
} from "marklie-ts-core";
import { OrganizationRole } from "marklie-ts-core/dist/lib/enums/enums.js";
import { AuthenticationUtil, Database } from "marklie-ts-core";
import { UserService } from "./UserService.js";

const database = await Database.getInstance();

export class OrganizationService {
  private readonly userService = new UserService();

  async createOrganization(name: string, user: User) {
    const org = database.em.create(Organization, {
      name,
      members: [],
      clients: [],
    });
    await this.userService.setActiveOrganization(org.uuid, user);

    const member = database.em.create(OrganizationMember, {
      organization: org,
      user,
      role: OrganizationRole.OWNER,
    });

    await database.em.persistAndFlush([org, member]);
  }

  async generateInviteCode(user: User): Promise<string> {
    const [roleEntry] =
      await AuthenticationUtil.getUserRoleInOrganization(user);
    if (roleEntry.role !== OrganizationRole.OWNER)
      throw new Error("Only owners can invite");

    const code = this.generateRandomCode(4);
    const invite = database.em.create(OrganizationInvite, {
      organization: user.activeOrganization,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await database.em.persistAndFlush(invite);
    return code;
  }

  async useInviteCode(code: string, user: User): Promise<void> {
    const invite = await database.em.findOne(OrganizationInvite, { code });
    if (!invite || invite.expiresAt < new Date() || invite.usedAt)
      throw new Error("Invalid or expired code");

    const member = database.em.create(OrganizationMember, {
      organization: invite.organization,
      user,
      role: OrganizationRole.READER,
    });

    user.activeOrganization = invite.organization;
    invite.usedAt = new Date();
    invite.usedBy = user.uuid;

    await database.em.persistAndFlush([member, user, invite]);
  }

  private generateRandomCode(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  }
}
