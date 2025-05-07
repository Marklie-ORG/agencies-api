import { ClientToken, Database, Organization, OrganizationClient, User } from "marklie-ts-core";
import { ClientTokenType, OrganizationRole } from "marklie-ts-core/dist/lib/enums/enums.js";
import { OrganizationInvite } from "marklie-ts-core/dist/lib/entities/OrganizationInvite.js";
import { OrganizationMember } from "marklie-ts-core/dist/lib/entities/OrganizationMember.js";
import { ClientFacebookAdAccount } from "marklie-ts-core/dist/lib/entities/ClientFacebookAdAccount.js";
import { AuthenticationUtil } from "marklie-ts-core";
import { UserService } from "./UserService.js";
import { SlackApi } from "lib/apis/SlackApi.js";
import type { Conversations, Channel, IM } from "marklie-ts-core/dist/lib/interfaces/OrganizationInterfaces.js";
import type { UpdateClientRequest } from "marklie-ts-core/dist/lib/interfaces/ClientInterfaces.js";


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

  async createClient(name: string, activeOrganizationUuid: string): Promise<OrganizationClient> {
    const newClient = database.em.create(OrganizationClient, {
        name: name,
        organization: activeOrganizationUuid
    });

    await database.em.persistAndFlush(newClient);

    return newClient;
  }

  async getClients(activeOrganizationUuid: string) {
    const clients = await database.em.find(OrganizationClient, { organization: activeOrganizationUuid });
    return clients;
  }

  async getClient(clientUuid: string) {
    const client = await database.em.findOne(OrganizationClient, { uuid: clientUuid });
    return client;
  }

  async updateClient(clientUuid: string, client: UpdateClientRequest) {
    const existingClient = await database.em.findOne(OrganizationClient, { uuid: clientUuid });
    if (!existingClient) {
      throw new Error("Client not found");
    }

    if (client.name !== undefined) {
      existingClient.name = client.name;
    }

    if (client.emails !== undefined) {
      existingClient.emails = client.emails;
    }

    await database.em.persistAndFlush(existingClient);
    return existingClient;
  }

  async getClientFacebookAdAccounts(clientUuid: string) {
    const clients = await database.em.find(ClientFacebookAdAccount, { client: clientUuid });
    return clients;
  }

  async createClientFacebookAdAccount(clientUuid: string, adAccountId: string) {
    const newClientFacebookAdAccount = database.em.create(ClientFacebookAdAccount, { client: clientUuid, adAccountId });
    await database.em.persistAndFlush(newClientFacebookAdAccount);
  }

  async deleteClientFacebookAdAccount(clientUuid: string, adAccountId: string) {
    const clientFacebookAdAccount = await database.em.findOne(ClientFacebookAdAccount, { client: clientUuid, adAccountId });
    if (!clientFacebookAdAccount) {
      throw new Error("Client Facebook Ad Account not found");
    }
    await database.em.removeAndFlush(clientFacebookAdAccount);
  }

  async createClientToken(token: string, clientUuid: string, type: ClientTokenType): Promise<ClientToken> {
    const client = await database.em.findOne(OrganizationClient, { uuid: clientUuid });
    if (!client) throw new Error("Client not found");

    const existingToken = await database.em.findOne(ClientToken, {
      organizationClient: clientUuid,
      type: type
    });
  
    const clientToken = existingToken ?? new ClientToken();
  
    clientToken.token = token;
    clientToken.type = type;
    clientToken.organizationClient = client;
    clientToken.organization = client.organization;
  
    client.slackConversationId = null;
  
    await database.em.persistAndFlush([clientToken, client]);
  
    return clientToken;
  }

  async getAvailableSlackConversations(organizationClientId: string): Promise<Conversations> {

    let channels: Channel[] = [];
    let ims: IM[] = [];

    const clientToken = await database.em.findOne(ClientToken, { 
      organizationClient: organizationClientId,
      type: ClientTokenType.SLACK 
    });

    if (!clientToken) throw new Error("Slack token not found for client");

    const accessToken = clientToken.token;

    const slackApi = new SlackApi(accessToken);
    const conversations = await slackApi.getConversationsList();
    const users = await slackApi.getUsersList();

    channels = conversations.channels.map((channel: { id: string, name: string, is_channel: boolean }) => {
      if (channel.is_channel) {
        return {
          id: channel.id,
          name: channel.name
        }
      }
      else {
        return null;
      }
    }).filter((channel: any) => channel !== null);

    ims = users.members.map((member: any) => {
      return {
        id: member.id,
        name: member.profile.real_name,
        image: member.profile.image_48
      }
    });

    return {
      channels,
      ims
    };
  }

  async isSlackWorkspaceConnected(organizationClientId: string): Promise<boolean> {

    const clientToken = await database.em.findOne(ClientToken, { 
      organizationClient: organizationClientId,
      type: ClientTokenType.SLACK 
    });

    if (clientToken) {
      return true
    }

    return false;

  }

  async setSlackConversationId(organizationClientId: string, conversationId: string) {
    const client = await database.em.findOne(OrganizationClient, { 
      uuid: organizationClientId
    });
    if (!client) throw new Error("Client not found");

    const isUserId = conversationId.startsWith("U");
    const isChannelId = conversationId.startsWith("C");

    if (!isUserId && !isChannelId) {
      throw new Error(`Invalid Slack conversation ID: ${conversationId}`);
    }

    if (isUserId) {
      client.slackConversationId = conversationId;
    }
    else {
      const clientToken = await database.em.findOne(ClientToken, { 
        organizationClient: organizationClientId,
        type: ClientTokenType.SLACK 
      });
      if (!clientToken) throw new Error("Slack token not found for client");

      const slackApi = new SlackApi(clientToken.token);
      const response = await slackApi.joinChannel(conversationId);

      if (!response.ok) {
        throw new Error("Failed to join Slack channel");
      }

      client.slackConversationId = conversationId;
    }
    
    await database.em.persistAndFlush(client);

    return client;
  }

  async sendSlackMessage(organizationClientId: string, message: string) {
    const client = await database.em.findOne(OrganizationClient, { 
      uuid: organizationClientId
    });

    if (!client) {
      throw new Error("Client not found");
    }
    
    if (!client.slackConversationId) {
      throw new Error("Slack conversation ID not found for client");
    }

    const clientToken = await database.em.findOne(ClientToken, { 
      organizationClient: organizationClientId,
      type: ClientTokenType.SLACK 
    });

    if (!clientToken) {
      throw new Error("Slack token not found for client");
    }

    const slackApi = new SlackApi(clientToken.token);
    const response = await slackApi.sendMessage(client.slackConversationId, message);

    return response;
  }

  async getConnectedSlackWorkspaces(organizationUuid: string) {
    const tokens = await database.em.find(ClientToken, { 
      organization: { uuid: organizationUuid },
      type: ClientTokenType.SLACK 
    }, {
      populate: ['organizationClient']
    });

    const workspaces = await Promise.all(tokens.map(async (token: ClientToken) => {
      const slackApi = new SlackApi(token.token);
      const response = await slackApi.getTeamInfo();
      return {
        clientName: token.organizationClient.name,
        clientId: token.organizationClient.uuid,
        tokenId: token.uuid,
        teamId: response.team.id,
        name: response.team.name,
        image: response.team.icon.image_34
      };
    }));

    return workspaces;
  }

  async setSlackWorkspaceToken(organizationClientId: string, tokenId: string) {
    const token = await database.em.findOne(ClientToken, { 
      uuid: tokenId
    });

    if (!token) {
      throw new Error("Token not found");
    }

    const clientToken = await this.createClientToken(token.token, organizationClientId, ClientTokenType.SLACK);

    return clientToken;
    
  }

  async sendMessageWithFileToSlack(organizationClientId: string, message: string, pdfBuffer: Buffer, fileName: string) {

    

    const client = await database.em.findOne(OrganizationClient, { 
      uuid: organizationClientId
    });

    const clientToken = await database.em.findOne(ClientToken, { 
      organizationClient: organizationClientId,
      type: ClientTokenType.SLACK 
    });

    if (!clientToken) {
      throw new Error("Slack token not found for client");
    }

    const slackApi = new SlackApi(clientToken.token);

    const uploadUrl = await slackApi.getUploadUrl(
      fileName, 
      pdfBuffer.length
    );

    await slackApi.uploadFile(
      uploadUrl.upload_url, 
      pdfBuffer
    );

    await slackApi.completeUpload(
      [{id: uploadUrl.file_id, title: fileName}]
    );

    const sendMessageResponse = await slackApi.sendMessage(
      client.slackConversationId, 
      message, 
      uploadUrl.file_id
    );

    return sendMessageResponse;
  }
  

}

