import {
  ActivityLog,
  AuthenticationUtil,
  Database,
  Organization,
  OrganizationClient,
  OrganizationInvite,
  OrganizationMember,
  PubSubWrapper,
  SchedulingOption,
  User,
  ClientAccessToken,
  ClientAccessRequest,
  Report
} from "marklie-ts-core";
import { OrganizationRole } from "marklie-ts-core/dist/lib/enums/enums.js";
import { UserService } from "./UserService.js";
import cronstrue from "cronstrue";
import type { NotifyClientAccessRequestedMessage } from "marklie-ts-core/dist/lib/interfaces/PubSubInterfaces.js";

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
    const [roleEntry] =
      await AuthenticationUtil.getUserRoleInOrganization(user);
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
      frequency: cronstrue.toString(schedule.schedule.cronExpression),
    }));
  }

  async getClientAccessRequests(
    organizationUuid: string,
  ): Promise<ClientAccessRequest[]> {
    const clients = await database.em.find(OrganizationClient, {
      organization: organizationUuid,
    });

    if (clients.length === 0) {
      return [];
    }

    const clientIds = clients.map((client: OrganizationClient) => client.uuid);

    return await database.em.find(
      ClientAccessRequest,
      { organizationClient: { $in: clientIds } },
      {
        populate: ["organizationClient"],
        orderBy: { createdAt: "DESC" },
      },
    );
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

  async sendClientAccessEmail(clientUuid: string, emails: string[], user: User): Promise<void> {
    const client = await database.em.findOne(OrganizationClient, { uuid: clientUuid, organization: user.activeOrganization! });
    if (!client) throw new Error("Client not found");

    const topic = "notification-send-client-access-email";

    for (let email of emails) {
      const clientAccessToken =
        AuthenticationUtil.signClientAccessToken(clientUuid);

      const token = database.em.create(ClientAccessToken, {
        token: clientAccessToken,
        user: user,
        organizationClient: client,
        isUsed: false,
      });
      await database.em.persistAndFlush(token);

        const payload = {
          token: clientAccessToken,
          email: email,
        };

      await PubSubWrapper.publishMessage(topic, payload);
    }
    
  }

  async verifyClientAccess(
    token: string
  ): Promise<string> {
    const tokenData =
      await AuthenticationUtil.verifyClientAccessToken(token);

    if (!tokenData) {
      throw new Error("Invalid or expired client access token");
    }

    const { clientUuid, isExpired, isClientAccessToken } =
      tokenData;

    if (isExpired) {
      throw new Error("Token expired");
    }

    if (!isClientAccessToken) {
      throw new Error("Token is not for client access");
    }

    const client = await database.em.findOne(OrganizationClient, { uuid: clientUuid });
    if (!client) {
      throw new Error("Client not found");
    }

    const clientAccessRequests = await database.em.find(ClientAccessRequest, { organizationClient: client });

    if (!clientAccessRequests.length) {
      throw new Error("Client access request does not exist");
    }

    const existingToken = await database.em.findOne(ClientAccessToken, {
      token: token
    });

    if (!existingToken) {
      throw new Error("Token does not exist");
    }

    if (existingToken.isUsed) {
      throw new Error("Token already used");
    }

    existingToken.isUsed = true;

    await database.em.persistAndFlush(existingToken);

    for (const req of clientAccessRequests) {
      req.isGranted = true;
    }
    await database.em.persistAndFlush(clientAccessRequests);

    return AuthenticationUtil.signClientAccessRefreshToken(clientUuid);
  }

  async requestClientAccess(requestData: { 
    email: string,
    reportUuid?: string,
    clientUuid?: string
  }): Promise<void> {
    let client;

    if (requestData.clientUuid) {
      client = await database.em.findOne(OrganizationClient, { uuid: requestData.clientUuid });
    }
    else {

      if (requestData.reportUuid) {
        let report = await database.em.findOne(Report, { uuid: requestData.reportUuid });
        client = await database.em.findOne(OrganizationClient, { uuid: report?.client.uuid! });
      }
      
    }
    
    if (!client) throw new Error("Client not found");

    const request = database.em.create(ClientAccessRequest, {
      organizationClient: client,
      email: requestData.email,
      isGranted: false,
    });
    await database.em.persistAndFlush(request);

    const organization = await database.em.findOne(
      Organization,
      { uuid: client.organization.uuid },
      { populate: ["members.user"] },
    );

    if (!organization) {
      return;
    }

    const topic = "notification-client-access-requested";

    const members = organization.members.getItems();

    const publishPromises = members
      .filter((member) => !!member.user?.email)
      .map((member) => {
        const payload: NotifyClientAccessRequestedMessage = {
          recipientEmail: member.user.email,
          requesterEmail: requestData.email,
          clientName: client.name,
          organizationUuid: organization.uuid,
        };

        return PubSubWrapper.publishMessage(topic, payload);
      });

    await Promise.all(publishPromises);
  }

}
