import Router from "koa-router";
import type { Context } from "koa";

import type {
  CreateClientFacebookAdAccountRequest,
  CreateClientRequest,
  SetSlackConversationIdRequest,
  SetSlackWorkspaceTokenRequest,
  UpdateClientRequest,
} from "marklie-ts-core/dist/lib/interfaces/ClientInterfaces.js";
import { ClientService } from "../services/ClientService.js";
import { SlackService, TokenService } from "marklie-ts-core";

export class ClientController extends Router {
  private readonly clientsService: ClientService;
  constructor() {
    super({ prefix: "/api/clients" });
    const tokenService = new TokenService();
    const slackService = new SlackService(tokenService);
    this.clientsService = new ClientService(slackService, tokenService);
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.post("/", this.createClient.bind(this));
    this.get("/", this.getClients.bind(this));
    this.get("/:clientUuid", this.getClient.bind(this));
    this.get("/:clientUuid/logs", this.getClientLogs.bind(this));
    this.put("/:clientUuid", this.updateClient.bind(this));

    this.get(
      "/:clientUuid/ad-accounts",
      this.getClientFacebookAdAccounts.bind(this),
    );
    this.post(
      "/:clientUuid/ad-accounts",
      this.createClientFacebookAdAccount.bind(this),
    );
    this.delete(
      "/:clientUuid/ad-accounts/:adAccountId",
      this.deleteClientFacebookAdAccount.bind(this),
    );

    this.get(
      "/:clientUuid/slack/conversations",
      this.getSlackAvailableConversations.bind(this),
    );
    this.get(
      "/:clientUuid/slack/is-workspace-connected",
      this.isSlackWorkspaceConnected.bind(this),
    );
    this.put(
      "/:clientUuid/slack/conversation-id",
      this.setSlackConversationId.bind(this),
    );
    this.get(
      "/:clientUuid/slack/workspaces",
      this.getConnectedSlackWorkspaces.bind(this),
    );
    this.post(
      "/:clientUuid/slack/workspace-token",
      this.setSlackWorkspaceToken.bind(this),
    );
  }

  private async createClient(ctx: Context) {
    const body = ctx.request.body as CreateClientRequest;
    const user = ctx.state.user;

    const client = await this.clientsService.createClient(
      body.name,
      user.activeOrganization.uuid,
    );

    if (body.facebookAdAccounts.length > 0) {
      for (const adAccountId of body.facebookAdAccounts) {
        await this.clientsService.createClientFacebookAdAccount(
          client.uuid,
          adAccountId,
        );
      }
    }

    ctx.body = { message: "Client created successfully." };
    ctx.status = 200;
  }

  private async getClients(ctx: Context) {
    const user = ctx.state.user;

    ctx.body = await this.clientsService.getClients(user.activeOrganization);

    ctx.status = 200;
  }

  private async getClientLogs(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;

    ctx.body = await this.clientsService.getClientLogs(clientUuid);
    ctx.status = 200;
  }

  private async getClient(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    ctx.body = await this.clientsService.getClient(clientUuid);
    ctx.status = 200;
  }

  private async updateClient(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const body = ctx.request.body as UpdateClientRequest;

    ctx.body = await this.clientsService.updateClient(clientUuid, body);
    ctx.status = 200;
  }

  private async getClientFacebookAdAccounts(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;

    ctx.body =
      await this.clientsService.getClientFacebookAdAccounts(clientUuid);
    ctx.status = 200;
  }

  private async createClientFacebookAdAccount(ctx: Context) {
    const body = ctx.request.body as CreateClientFacebookAdAccountRequest;
    const clientUuid = ctx.params.clientUuid;

    await this.clientsService.createClientFacebookAdAccount(
      clientUuid,
      body.adAccountId,
    );

    ctx.body = { message: "Client Facebook Ad Account created successfully." };
    ctx.status = 200;
  }

  private async deleteClientFacebookAdAccount(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const adAccountId = ctx.params.adAccountId;

    await this.clientsService.deleteClientFacebookAdAccount(
      clientUuid,
      adAccountId,
    );

    ctx.body = { message: "Client Facebook Ad Account deleted successfully." };
    ctx.status = 200;
  }

  private async getSlackAvailableConversations(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;

    ctx.body = await this.clientsService.getSlackConversations(clientUuid);
    ctx.status = 200;
  }

  private async isSlackWorkspaceConnected(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const isConnected = await this.clientsService.isSlackConnected(clientUuid);

    ctx.body = { isConnected };
    ctx.status = 200;
  }

  private async setSlackConversationId(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const body = ctx.request.body as SetSlackConversationIdRequest;

    await this.clientsService.setSlackConversation(
      clientUuid,
      body.conversationId,
    );

    ctx.body = { message: "Slack conversation ID set successfully." };
    ctx.status = 200;
  }

  private async getConnectedSlackWorkspaces(ctx: Context) {
    const user = ctx.state.user;

    const workspaces = await this.clientsService.getConnectedSlackWorkspaces(
      user.activeOrganization,
    );

    ctx.body = workspaces;
    ctx.status = 200;
  }

  private async setSlackWorkspaceToken(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const body = ctx.request.body as SetSlackWorkspaceTokenRequest;

    await this.clientsService.setSlackWorkspaceToken(clientUuid, body.tokenId);

    ctx.body = { message: "Slack workspace token set successfully." };
    ctx.status = 200;
  }
}
