import { Database, Organization, OrganizationClient, User } from "markly-ts-core";
import { OrganizationRole } from "markly-ts-core/dist/lib/enums/enums.js";
import { OrganizationInvite } from "markly-ts-core/dist/lib/entities/OrganizationInvite.js";
import { OrganizationMember } from "markly-ts-core/dist/lib/entities/OrganizationMember.js";
import { AuthenticationUtil } from "markly-ts-core";
import { UserService } from "./UserService.js";

const database = await Database.getInstance();

export class OrganizationService {

  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createOrganization(name: string, user: User) {
    const newOrganization = database.em.create(Organization, {
      name: name,
      members: [],
      clients: []
    });

    await this.userService.setActiveOrganization(
        newOrganization.uuid,
        user,
      );

    const organizationMember = database.em.create(OrganizationMember, {
      organization: newOrganization,
      user: user,
      role: OrganizationRole.OWNER // the creator should be an owner
    });

    await database.em.persistAndFlush([newOrganization, organizationMember]);
  }

  async generateInviteCode(user: User): Promise<string> {
    const userRoles = await AuthenticationUtil.getUserRoleInOrganization(user);
    
    if (userRoles[0].role !== OrganizationRole.OWNER) {
      throw new Error("Only organization owners can generate invite codes");
    }

    const code = this.generateRandomCode(4);

    const invite = database.em.create(OrganizationInvite, {
      organization: user.activeOrganization,
      code,
      expiresAt: new Date(Date.now() + (5 * 60 * 1000))
    });

    await database.em.persistAndFlush(invite);

    return code;
  }

  private generateRandomCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async useInviteCode(code: string, user: User): Promise<void> {
    const invite = await database.em.findOne(OrganizationInvite, { code });
    
    if (!invite) {
      throw new Error("Invalid invite code");
    }

    if (invite.expiresAt < new Date()) {
      throw new Error("Invite code has expired");
    }

    if (invite.usedAt) {
      throw new Error("Invite code has already been used");
    }

    const orgMember = database.em.create(OrganizationMember, {
      organization: invite.organization,
      user: user,
      role: OrganizationRole.READER // Default role for invited members
    });

    user.activeOrganization = invite.organization;

    invite.usedAt = new Date();
    invite.usedBy = user.uuid;

    await database.em.persistAndFlush([orgMember, user, invite]);
  }

  async createOrganizationClient(name: string, activeOrganizationUuid: string) {
    const newClient = database.em.create(OrganizationClient, {
        name: name,
        organization: activeOrganizationUuid
    });

    await database.em.persistAndFlush(newClient);
  }

  async getOrganizationClients(activeOrganizationUuid: string) {
    const clients = await database.em.find(OrganizationClient, { organization: activeOrganizationUuid });
    return clients;
  }

}
