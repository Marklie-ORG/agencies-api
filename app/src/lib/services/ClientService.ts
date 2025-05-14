import {
  ClientFacebookAdAccount,
  ClientToken,
  Database,
  OrganizationClient,
  SchedulingOption,
} from "marklie-ts-core";
import cronstrue from "cronstrue";
import { TokenService } from "./TokenService";
import { ClientTokenType } from "marklie-ts-core/dist/lib/enums/enums.js";
import type { SlackService } from "./SlackService.js";
import type { UpdateClientRequest } from "marklie-ts-core/dist/lib/interfaces/ClientInterfaces";

const database = await Database.getInstance();

export class ClientService {
  constructor(
    private slackService: SlackService,
    private tokenService: TokenService,
  ) {}

  async createClient(name: string, orgUuid: string) {
    const client = database.em.create(OrganizationClient, {
      name,
      organization: orgUuid,
    });
    await database.em.persistAndFlush(client);
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

  async getClients(orgUuid: string) {
    return await database.em.find(OrganizationClient, {
      organization: orgUuid,
    });
  }

  async createClientFacebookAdAccount(clientUuid: string, adAccountId: string) {
    const newClientFacebookAdAccount = database.em.create(
      ClientFacebookAdAccount,
      { client: clientUuid, adAccountId },
    );
    await database.em.persistAndFlush(newClientFacebookAdAccount);
  }

  async deleteClientFacebookAdAccount(clientUuid: string, adAccountId: string) {
    const clientFacebookAdAccount = await database.em.findOne(
      ClientFacebookAdAccount,
      { client: clientUuid, adAccountId },
    );
    if (!clientFacebookAdAccount) {
      throw new Error("Client Facebook Ad Account not found");
    }
    await database.em.removeAndFlush(clientFacebookAdAccount);
  }

  async getClient(uuid: string) {
    const client = await database.em.findOne(
      OrganizationClient,
      { uuid },
      { populate: ["schedulingOption.client", "adAccounts.client"] },
    );

    if (!client) {
      throw new Error("Client not found");
    }

    return {
      uuid: client.uuid,
      name: client.name,
      emails: client.emails,
      adAccountId: "",
      crons:
        client.schedulingOption?.getItems().map((opt: SchedulingOption) => ({
          uuid: opt.uuid,
          cronExpression: cronstrue.toString(opt.cronExpression),
          isActive: opt.isActive,
          nextRun: opt.nextRun,
          dataPreset: opt.datePreset,
          reviewNeeded: opt.reviewNeeded,
        })) ?? [],
    };
  }

  async manageAdAccount(
    clientUuid: string,
    adAccountId: string,
    action: "add" | "delete",
  ) {
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

  async getClientFacebookAdAccounts(clientUuid: string) {
    return await database.em.find(ClientFacebookAdAccount, {
      client: clientUuid,
    });
  }

  async sendSlackMessageWithFile(
    clientId: string,
    message: string,
    pdfBuffer: Buffer,
    fileName: string,
  ) {
    return this.slackService.sendSlackMessageWithFile(
      clientId,
      message,
      pdfBuffer,
      fileName,
    );
  }

  async getConnectedSlackWorkspaces(orgUuid: string) {
    return await database.em.find(ClientToken, {
      organization: orgUuid,
      type: ClientTokenType.SLACK,
    });
  }

  async setSlackWorkspaceToken(clientUuid: string, token: string) {
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

  async createToken(clientUuid: string, token: string, type: ClientTokenType) {
    const client = await database.em.findOne(OrganizationClient, {
      uuid: clientUuid,
    });
    if (!client) throw new Error("Client not found");
    await this.tokenService.createOrUpdateToken(client, token, type);
    client.slackConversationId = null;
    await database.em.persistAndFlush(client);
  }

  async isSlackConnected(clientUuid: string) {
    return await this.tokenService.hasSlackToken(clientUuid);
  }

  async getSlackConversations(clientUuid: string) {
    return this.slackService.getSlackConversations(clientUuid);
  }

  async setSlackConversation(clientId: string, conversationId: string) {
    await this.slackService.setSlackConversation(clientId, conversationId);
  }

  async sendSlackMessage(clientId: string, message: string) {
    await this.slackService.sendSlackMessage(clientId, message);
  }
}
