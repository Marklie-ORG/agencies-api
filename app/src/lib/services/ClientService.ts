import type { SlackService } from "marklie-ts-core";
import {
  ActivityLog,
  ClientFacebookAdAccount,
  ClientToken,
  Database,
  OrganizationClient,
  SlackApi,
  TokenService,
} from "marklie-ts-core";
import { ClientTokenType } from "marklie-ts-core/dist/lib/enums/enums.js";
import type { UpdateClientRequest } from "marklie-ts-core/dist/lib/interfaces/ClientInterfaces";
import {
  CommunicationChannel,
  EmailChannel,
  WhatsAppChannel,
} from "marklie-ts-core/dist/lib/entities/ClientCommunicationChannel.js";

const database = await Database.getInstance();

export class ClientService {
  constructor(
    private slackService: SlackService,
    private tokenService: TokenService,
  ) {}

  async createClient(
    name: string,
    orgUuid: string,
  ): Promise<OrganizationClient> {
    const client = database.em.create(OrganizationClient, {
      name,
      organization: orgUuid,
    });
    await database.em.persistAndFlush(client);
    return client;
  }

  async updateClient(
    clientUuid: string,
    client: UpdateClientRequest,
  ): Promise<OrganizationClient> {
    const existingClient = await database.em.findOne(OrganizationClient, {
      uuid: clientUuid,
    });
    if (!existingClient) {
      throw new Error("Client not found");
    }

    if (client.name) {
      existingClient.name = client.name;
    }

    if (client.emails) {
      const existingEmailChannels = await database.em.find(EmailChannel, {
        client: existingClient,
      });

      const newEmails = new Set(client.emails);

      const oldEmails = new Set(
        existingEmailChannels.map((ch: EmailChannel) => ch.emailAddress),
      );

      for (const ch of existingEmailChannels) {
        if (!newEmails.has(ch.emailAddress)) {
          database.em.remove(ch);
        }
      }

      for (const email of client.emails) {
        console.log(email, !oldEmails.has(email));

        if (!oldEmails.has(email)) {
          const newChannel = new EmailChannel();
          newChannel.client = existingClient;
          newChannel.emailAddress = email;
          await database.em.persist(newChannel);
        }
      }
    }

    if (client.phoneNumbers !== undefined) {
      const existingWhatsappChannels = await database.em.find(WhatsAppChannel, {
        client: existingClient,
      });

      const newPhones = new Set(client.phoneNumbers);
      const oldPhones = new Set(
        existingWhatsappChannels.map((ch: WhatsAppChannel) => ch.phoneNumber),
      );

      for (const ch of existingWhatsappChannels) {
        if (!newPhones.has(ch.phoneNumber)) {
          database.em.remove(ch);
        }
      }

      for (const phone of client.phoneNumbers) {
        if (!oldPhones.has(phone)) {
          const newChannel = new WhatsAppChannel();
          newChannel.client = existingClient;
          newChannel.phoneNumber = phone;
          await database.em.persist(newChannel);
        }
      }
    }

    await database.em.flush();
    return existingClient;
  }

  async getClients(orgUuid: string): Promise<OrganizationClient[]> {
    return await database.em.find(OrganizationClient, {
      organization: orgUuid,
    });
  }

  async getClientLogs(clientUuid: string): Promise<ActivityLog[]> {
    return await database.em.find(
      ActivityLog,
      {
        client: clientUuid,
      },
      {
        populate: ["client"],
        orderBy: { createdAt: "DESC" },
      },
    );
  }

  async createClientFacebookAdAccount(
    clientUuid: string,
    adAccountId: string,
  ): Promise<void> {
    const newAcc = database.em.create(ClientFacebookAdAccount, {
      client: clientUuid,
      adAccountId,
    });
    await database.em.persistAndFlush(newAcc);
  }

  async deleteClientFacebookAdAccount(
    clientUuid: string,
    adAccountId: string,
  ): Promise<void> {
    const acc = await database.em.findOne(ClientFacebookAdAccount, {
      client: clientUuid,
      adAccountId,
    });
    if (!acc) throw new Error("Client Facebook Ad Account not found");
    await database.em.removeAndFlush(acc);
  }

  async getClient(uuid: string): Promise<{
    uuid: string;
    name: string;
    adAccountId: string;
    emails: string[];
    slack: string;
    phoneNumbers: string[];
  }> {
    const client = await database.em.findOne(
      OrganizationClient,
      { uuid },
      {
        populate: ["schedulingOption.client", "adAccounts.client"],
      },
    );

    if (!client) {
      throw new Error("Client not found");
    }

    const communicationChannels = await database.em.find(CommunicationChannel, {
      client,
    });

    const emails = communicationChannels
      .filter((ch) => ch.constructor.name === "EmailChannel")
      .map((ch: any) => ch.emailAddress);

    const phoneNumbers = communicationChannels
      .filter((ch) => ch.constructor.name === "WhatsAppChannel")
      .map((ch: any) => ch.phoneNumber);

    const slack = communicationChannels
      .filter((ch) => ch.constructor.name === "SlackChannel")
      .map((ch: any) => ch.conversationId);

    return {
      uuid: client.uuid,
      name: client.name,
      adAccountId: "",
      emails,
      phoneNumbers,
      slack: slack[0],
    };
  }

  async manageAdAccount(
    clientUuid: string,
    adAccountId: string,
    action: "add" | "delete",
  ): Promise<void> {
    if (action === "add") {
      const newAcc = database.em.create(ClientFacebookAdAccount, {
        client: clientUuid,
        adAccountId,
      });
      await database.em.persistAndFlush(newAcc);
    } else {
      const acc = await database.em.findOne(ClientFacebookAdAccount, {
        client: clientUuid,
        adAccountId,
      });
      if (!acc) throw new Error("Ad account not found");
      await database.em.removeAndFlush(acc);
    }
  }

  async getClientFacebookAdAccounts(
    clientUuid: string,
  ): Promise<ClientFacebookAdAccount[]> {
    return await database.em.find(ClientFacebookAdAccount, {
      client: clientUuid,
    });
  }

  async getConnectedSlackWorkspaces(organizationUuid: string): Promise<
    Array<{
      clientName: string;
      clientId: string;
      tokenId: string;
      teamId: string;
      name: string;
      image: string;
    }>
  > {
    const tokens = await database.em.find(
      ClientToken,
      {
        organization: { uuid: organizationUuid },
        type: ClientTokenType.SLACK,
      },
      {
        populate: ["organizationClient"],
      },
    );

    return await Promise.all(
      tokens.map(async (token: ClientToken) => {
        const slackApi = new SlackApi(token.token);
        const response = await slackApi.getTeamInfo();
        return {
          clientName: token.organizationClient.name,
          clientId: token.organizationClient.uuid,
          tokenId: token.uuid,
          teamId: response.team.id,
          name: response.team.name,
          image: response.team.icon.image_34,
        };
      }),
    );
  }

  async setSlackWorkspaceToken(
    clientUuid: string,
    token: string,
  ): Promise<void> {
    const client = await database.em.findOne(OrganizationClient, {
      uuid: clientUuid,
    });
    if (!client) throw new Error("Client not found");

    await this.tokenService.createOrUpdateToken(
      client,
      token,
      ClientTokenType.SLACK,
    );
  }

  async createToken(
    clientUuid: string,
    token: string,
    type: ClientTokenType,
  ): Promise<void> {
    const client = await database.em.findOne(OrganizationClient, {
      uuid: clientUuid,
    });
    if (!client) throw new Error("Client not found");
    await this.tokenService.createOrUpdateToken(client, token, type);

    await database.em.persistAndFlush(client);
  }

  async isSlackConnected(clientUuid: string): Promise<boolean> {
    return await this.tokenService.hasSlackToken(clientUuid);
  }

  async getSlackConversations(clientUuid: string): Promise<{
    channels: Array<{ id: string; name: string }>;
    ims: Array<{ id: string; name: string; image: string }>;
  }> {
    return this.slackService.getSlackConversations(clientUuid);
  }

  async setSlackConversation(
    clientId: string,
    conversationId: string,
  ): Promise<void> {
    await this.slackService.setSlackConversation(clientId, conversationId);
  }

  async sendSlackMessage(clientId: string, message: string): Promise<void> {
    await this.slackService.sendSlackMessage(clientId, message);
  }
}
