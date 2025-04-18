import { Database, User } from "markly-ts-core";
import { OrganizationRole } from "markly-ts-core/dist/lib/enums/enums.js";
import { OrganizationInvite } from "markly-ts-core/dist/lib/entities/OrganizationInvite.js";
import { OrganizationMember } from "markly-ts-core/dist/lib/entities/OrganizationMember.js";
import { AuthenticationUtil } from "markly-ts-core";

const database = await Database.getInstance();

export class OrganizationService {

  async generateInviteCode(user: User): Promise<string> {
    // Check if user has owner role in their active organization
    const userRoles = await AuthenticationUtil.getUserRoleInOrganization(user);
    // console.log(userRole);
    if (userRoles[0].role !== OrganizationRole.OWNER) {
      throw new Error("Only organization owners can generate invite codes");
    }

    // Generate 4-letter code
    const code = this.generateRandomCode(4);

    // Create new invite
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
    // Find the invite by code
    const invite = await database.em.findOne(OrganizationInvite, { code });
    
    if (!invite) {
      throw new Error("Invalid invite code");
    }

    // Check if invite is expired
    if (invite.expiresAt < new Date()) {
      throw new Error("Invite code has expired");
    }

    // Check if invite is already used
    if (invite.usedAt) {
      throw new Error("Invite code has already been used");
    }

    // Create organization member
    const orgMember = database.em.create(OrganizationMember, {
      organization: invite.organization,
      user: user,
      role: OrganizationRole.READER // Default role for invited members
    });

    // Update user's active organization
    user.activeOrganization = invite.organization;

    // Mark invite as used
    invite.usedAt = new Date();
    invite.usedBy = user.uuid;

    // Save all changes in a single transaction
    await database.em.persistAndFlush([orgMember, user, invite]);
  }

}
