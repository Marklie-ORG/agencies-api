import {
  ActivityLog,
  ClientAdAccount,
  ClientToken,
  Database,
  OrganizationClient,
  RedisClient,
  ScheduledJob,
  SchedulingOption,
  SlackApi,
  type SlackService,
  TokenService,
} from "marklie-ts-core";
import { ClientTokenType } from "marklie-ts-core/dist/lib/enums/enums.js";
import type { UpdateClientRequest } from "marklie-ts-core/dist/lib/interfaces/ClientInterfaces";
import {
  CommunicationChannel,
  EmailChannel,
  WhatsAppChannel,
} from "marklie-ts-core/dist/lib/entities/ClientCommunicationChannel.js";
import Redis from "ioredis";

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
    const em = database.em.fork({ clear: true });
    return em.transactional(async (tem) => {
      const client = tem.create(OrganizationClient, {
        name,
        organization: orgUuid,
      });
      await tem.persistAndFlush(client);
      return tem.findOneOrFail(
        OrganizationClient,
        { uuid: client.uuid },
        { refresh: true },
      );
    });
  }

  async updateClient(
    clientUuid: string,
    client: UpdateClientRequest,
  ): Promise<OrganizationClient> {
    const em = database.em.fork({ clear: true });
    return await em.transactional(async (tem) => {
      const existingClient = await tem.findOne(OrganizationClient, {
        uuid: clientUuid,
      });
      if (!existingClient) throw new Error("Client not found");
      if (typeof client.name === "string" && client.name.trim().length) {
        existingClient.name = client.name.trim();
      }
      if (client.emails !== undefined) {
        const newEmails = new Set(
          (client.emails || []).map((e) => e.trim()).filter(Boolean),
        );
        if (newEmails.size === 0) {
          await tem.nativeDelete(EmailChannel, { client: existingClient });
        } else {
          await tem.nativeDelete(EmailChannel, {
            client: existingClient,
            emailAddress: { $nin: [...newEmails] },
          });
        }
        if (newEmails.size) {
          const existing = await tem.find(EmailChannel, {
            client: existingClient,
          });
          const oldEmails = new Set(existing.map((ch) => ch.emailAddress));
          for (const email of newEmails) {
            if (!oldEmails.has(email)) {
              tem.persist(
                tem.create(EmailChannel, {
                  client: existingClient,
                  emailAddress: email,
                  active: true,
                }),
              );
            }
          }
        }
      }
      if (client.phoneNumbers !== undefined) {
        const newPhones = new Set(
          (client.phoneNumbers || []).map((p) => p.trim()).filter(Boolean),
        );
        if (newPhones.size === 0) {
          await tem.nativeDelete(WhatsAppChannel, { client: existingClient });
        } else {
          await tem.nativeDelete(WhatsAppChannel, {
            client: existingClient,
            phoneNumber: { $nin: [...newPhones] },
          });
        }
        if (newPhones.size) {
          const existing = await tem.find(WhatsAppChannel, {
            client: existingClient,
          });
          const oldPhones = new Set(existing.map((ch) => ch.phoneNumber));
          for (const phone of newPhones) {
            if (!oldPhones.has(phone)) {
              tem.persist(
                tem.create(WhatsAppChannel, {
                  client: existingClient,
                  phoneNumber: phone,
                  active: true,
                }),
              );
            }
          }
        }
      }
      if (client.facebookAdAccounts !== undefined) {
        const desired = (client.facebookAdAccounts || [])
          .map((a) => ({
            adAccountId: a.adAccountId.trim(),
            adAccountName: a.adAccountName?.trim() ?? null,
            businessId: a.businessId?.trim() ?? null,
          }))
          .filter((a) => a.adAccountId);
        const desiredIds = new Set(desired.map((a) => a.adAccountId));
        const existing = await tem.find(ClientAdAccount, {
          client: existingClient,
          provider: "facebook",
        });
        await tem.nativeDelete(ClientAdAccount, {
          client: existingClient,
          provider: "facebook",
          adAccountId: { $nin: [...desiredIds] },
        });
        const existingById = new Map(existing.map((a) => [a.adAccountId, a]));
        for (const d of desired) {
          const found = existingById.get(d.adAccountId);
          if (!found) {
            tem.persist(
              tem.create(ClientAdAccount, {
                client: existingClient,
                provider: "facebook",
                adAccountId: d.adAccountId,
                adAccountName: d.adAccountName,
                businessId: d.businessId,
              }),
            );
          } else {
            let dirty = false;
            if (found.adAccountName !== d.adAccountName) {
              found.adAccountName = d.adAccountName;
              dirty = true;
            }
            if (found.businessId !== d.businessId) {
              found.businessId = d.businessId;
              dirty = true;
            }
            if (dirty) tem.persist(found);
          }
        }
      }
      await tem.flush();
      return await tem.findOneOrFail(
        OrganizationClient,
        { uuid: clientUuid },
        { populate: ["communicationChannels", "adAccounts"], refresh: true },
      );
    });
  }

  async getClients(orgUuid: string): Promise<OrganizationClient[]> {
    const em = database.em.fork({ clear: true });

    const clients = await em.find(OrganizationClient, {
      organization: orgUuid,
    });

    return await Promise.all(
      clients.map(async (client) => {
        const [count, last] = await Promise.all([
          em.count(SchedulingOption, { client: client.uuid }),
          em.findOne(
            SchedulingOption,
            { client: client.uuid, lastRun: { $ne: null } },
            { fields: ["lastRun"], orderBy: { lastRun: "DESC" } },
          ),
        ]);

        return {
          ...client,
          schedulesCount: count,
          lastActivity: last?.lastRun,
        };
      }),
    );
  }

  async getClientLogs(clientUuid: string): Promise<ActivityLog[]> {
    const em = database.em.fork({ clear: true });
    return await em.find(
      ActivityLog,
      { client: clientUuid },
      { populate: ["client"], orderBy: { createdAt: "DESC" } },
    );
  }

  async createClientFacebookAdAccount(
    clientUuid: string,
    adAccountId: string,
    adAccountName: string,
    businessId: string,
  ): Promise<void> {
    const em = database.em.fork({ clear: true });
    const newAcc = em.create(ClientAdAccount, {
      client: clientUuid,
      adAccountId,
      provider: "facebook",
      adAccountName,
      businessId,
    });
    await em.persistAndFlush(newAcc);
  }

  async deleteClientFacebookAdAccount(
    clientUuid: string,
    adAccountId: string,
  ): Promise<void> {
    const em = database.em.fork({ clear: true });
    const acc = await em.findOne(ClientAdAccount, {
      client: clientUuid,
      adAccountId,
    });
    if (!acc) throw new Error("Client Facebook Ad Account not found");
    await em.removeAndFlush(acc);
  }

  async deleteClient(clientUuid: string): Promise<void> {
    const db = await Database.getInstance();
    await db.em.transactional(async (em) => {
      const client = await em.findOneOrFail(OrganizationClient, {
        uuid: clientUuid,
      });
      const schedulingOptions = await em.find(SchedulingOption, {
        client: clientUuid,
      });
      for (const option of schedulingOptions) {
        const jobs = await em.find(ScheduledJob, {
          schedulingOption: option.uuid,
        });
        jobs.forEach((job) => em.remove(job));
        em.remove(option);
      }
      const adAccounts = await em.find(ClientAdAccount, { client: clientUuid });
      adAccounts.forEach((account) => em.remove(account));
      const channels = await em.find(CommunicationChannel, {
        client: clientUuid,
      });
      channels.forEach((channel) => em.remove(channel));
      const token = await em.findOne(ClientToken, {
        organizationClient: clientUuid,
      });
      if (token) em.remove(token);
      client.deletedAt = new Date();
      await em.persistAndFlush(client);
    });
  }

  async getClient(uuid: string): Promise<{
    uuid: string;
    name: string;
    adAccounts: {
      adAccountId: string;
      adAccountName: string;
      businessId: string;
    }[];
    emails: string[];
    slack: string;
    phoneNumbers: string[];
  }> {
    const em = database.em.fork({ clear: true });
    const client = await em.findOne(
      OrganizationClient,
      { uuid },
      {
        populate: ["adAccounts"],
        strategy: "joined",
        refresh: true,
      },
    );
    if (!client) throw new Error("Client not found");
    const adAccounts = client.adAccounts!.map((adAccount) => ({
      adAccountId: adAccount.adAccountId,
      adAccountName: adAccount.adAccountName,
      businessId: adAccount.businessId,
    }));
    const communicationChannels = await em.find(CommunicationChannel, {
      client,
    });
    const emails = communicationChannels
      .filter((ch) => ch instanceof EmailChannel)
      .map((ch: any) => ch.emailAddress);
    const phoneNumbers = communicationChannels
      .filter((ch) => ch instanceof WhatsAppChannel)
      .map((ch: any) => ch.phoneNumber);
    const slack = communicationChannels
      .filter((ch: any) => ch.constructor.name === "SlackChannel")
      .map((ch: any) => ch.conversationId);
    return {
      uuid: client.uuid,
      name: client.name,
      adAccounts,
      emails,
      phoneNumbers,
      slack: slack[0],
    };
  }

  async getClientFacebookAdAccounts(
    clientUuid: string,
  ): Promise<ClientAdAccount[]> {
    const em = database.em.fork({ clear: true });
    return await em.find(ClientAdAccount, { client: clientUuid });
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
    const em = database.em.fork({ clear: true });
    const tokens = await em.find(
      ClientToken,
      { organization: { uuid: organizationUuid }, type: ClientTokenType.SLACK },
      { populate: ["organizationClient"] },
    );
    return await Promise.all(
      tokens.map(async (token: ClientToken) => {
        const slackApi = new SlackApi(token.token);
        const response = await slackApi.getTeamInfo();
        return {
          clientName: token.organizationClient.name,
          clientId: token.organizationClient.uuid,
          tokenId: token.uuid,
          teamId: response.team?.id,
          name: response.team?.name,
          image: response.team?.icon.image_34,
        };
      }),
    );
  }

  async setSlackWorkspaceToken(
    clientUuid: string,
    token: string,
  ): Promise<void> {
    const em = database.em.fork({ clear: true });
    const client = await em.findOne(OrganizationClient, { uuid: clientUuid });
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
    const em = database.em.fork({ clear: true });
    const client = await em.findOne(OrganizationClient, { uuid: clientUuid });
    if (!client) throw new Error("Client not found");
    await this.tokenService.createOrUpdateToken(client, token, type);
    await em.persistAndFlush(client);
  }

  async isSlackConnected(clientUuid: string): Promise<boolean> {
    return await this.tokenService.hasSlackToken(clientUuid);
  }

  async getSlackConversations(clientUuid: string): Promise<{
    channels: Array<{ id: string; name: string }>;
    ims: Array<{ id: string; name: string; image: string }>;
  }> {
    const redis: Redis = RedisClient.getInstance();
    const cacheKey = `${clientUuid}/slack-conversations`;
    const cachedRaw = await redis.get(cacheKey);

    try {
      const conversations =
        await this.slackService.getSlackConversations(clientUuid);
      await redis.set(cacheKey, JSON.stringify(conversations));
      return conversations;
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status ?? err?.code;
      if (String(status) === "429" && cachedRaw) {
        return JSON.parse(cachedRaw);
      }
      if (cachedRaw) {
        return JSON.parse(cachedRaw);
      }
      throw err;
    }
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
