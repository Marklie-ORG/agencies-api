import {
  ActivityLog,
  AuthenticationUtil,
  Database,
  Organization,
  OrganizationClient,
  OrganizationInvite,
  OrganizationMember,
  SchedulingOption,
  User,
} from "marklie-ts-core";
import { OrganizationRole } from "marklie-ts-core/dist/lib/enums/enums.js";
import { UserService } from "./UserService.js";
import cronstrue from "cronstrue";

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

    if (!user.activeOrganization) {
      throw new Error("User does not have an active organization set");
    }

    const invite = database.em.create(OrganizationInvite, {
      organization: user.activeOrganization,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await database.em.persistAndFlush(invite);
    return code;
  }

  async listInviteCodes(user: User): Promise<OrganizationInvite[]> {
    const [roleEntry] = await AuthenticationUtil.getUserRoleInOrganization(user);
    if (roleEntry.role !== OrganizationRole.OWNER)
      throw new Error("Only owners can view invite codes");

    if (!user.activeOrganization) {
      throw new Error("User does not have an active organization set");
    }

    return await database.em.find(
      OrganizationInvite,
      { organization: user.activeOrganization },
      { orderBy: { createdAt: "DESC" } },
    );
  }

  async getLogs(orgUuid: string): Promise<ActivityLog[]> {
    return await database.em.find(
      ActivityLog,
      {
        organization: orgUuid,
      },
      {
        populate: ["client"],
        orderBy: { createdAt: "DESC" },
      },
    );
  }
  async getSchedulingOptions(
    uuid: string,
  ): Promise<(SchedulingOption & { frequency: string })[]> {
    const clients = await database.em.find(OrganizationClient, {
      organization: uuid,
    });

    const clientIds = clients.map((c: OrganizationClient) => c.uuid);

    const schedules = await database.em.find(
      SchedulingOption,
      { client: { $in: clientIds } },
      { populate: ["client"] },
    );

    return schedules.map((schedule: SchedulingOption) => ({
      ...schedule,
      frequency: cronstrue.toString(schedule.cronExpression),
    }));
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
