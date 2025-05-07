import Router from "koa-router";
import type { Context } from "koa";
import type { CreateClientRequest, UpdateClientRequest, CreateClientFacebookAdAccountRequest, SetSlackConversationIdRequest, SendMessageToSlackRequest, SetSlackWorkspaceTokenRequest, SendMessageWithFileToSlackRequest } from "marklie-ts-core/dist/lib/interfaces/ClientInterfaces.js";
import { OrganizationService } from "lib/services/OrganizationService.js";

export class ClientController extends Router {
  private readonly organizationService: OrganizationService;
  constructor() {
    super({ prefix: "/api/clients" });
    this.organizationService = new OrganizationService();
    this.setUpRoutes();
  } 

  private setUpRoutes() {
    this.post("/", this.createClient.bind(this));
    this.get("/", this.getClients.bind(this));
    this.get("/:clientUuid", this.getClient.bind(this));
    this.put("/:clientUuid", this.updateClient.bind(this));
    
    this.get("/:clientUuid/ad-accounts", this.getClientFacebookAdAccounts.bind(this));
    this.post("/:clientUuid/ad-accounts", this.createClientFacebookAdAccount.bind(this));
    this.delete("/:clientUuid/ad-accounts/:adAccountId", this.deleteClientFacebookAdAccount.bind(this));

    this.get("/:clientUuid/slack/conversations", this.getSlackAvailableConversations.bind(this));
    this.get("/:clientUuid/slack/is-workspace-connected", this.isSlackWorkspaceConnected.bind(this));
    this.put("/:clientUuid/slack/conversation-id", this.setSlackConversationId.bind(this));
    this.post("/:clientUuid/slack/send-message", this.sendSlackMessage.bind(this));
    this.get("/:clientUuid/slack/workspaces", this.getConnectedSlackWorkspaces.bind(this));
    this.post("/:clientUuid/slack/workspace-token", this.setSlackWorkspaceToken.bind(this));
    this.post("/:clientUuid/slack/send-message-with-file", this.sendMessageWithFileToSlack.bind(this));
  }

  private async createClient(ctx: Context) {
    const body = ctx.request.body as CreateClientRequest;
    const user = ctx.state.user;

    const client = await this.organizationService.createClient(body.name, user.activeOrganization.uuid);

    if (body.facebookAdAccounts.length > 0) {
      for (const adAccountId of body.facebookAdAccounts) {
        await this.organizationService.createClientFacebookAdAccount(client.uuid, adAccountId);
      }
    }

    ctx.body = { message: "Client created successfully." };
    ctx.status = 200;
  }

  private async getClients(ctx: Context) {
    const user = ctx.state.user;

    const clients = await this.organizationService.getClients(user.activeOrganization);

    ctx.body = clients;
    ctx.status = 200;
  }

  private async getClient(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const client = await this.organizationService.getClient(clientUuid);

    ctx.body = client;
    ctx.status = 200;
  }

  private async updateClient(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const body = ctx.request.body as UpdateClientRequest;

    const client = await this.organizationService.updateClient(clientUuid, body);

    ctx.body = client;
    ctx.status = 200;
  }

  private async getClientFacebookAdAccounts(ctx: Context) {
    // const user = ctx.state.user;
    const clientUuid = ctx.params.clientUuid;
    const facebookAdAccounts = await this.organizationService.getClientFacebookAdAccounts(clientUuid);

    ctx.body = facebookAdAccounts;
    ctx.status = 200;
  }

  private async createClientFacebookAdAccount(ctx: Context) {
    const body = ctx.request.body as CreateClientFacebookAdAccountRequest;
    const clientUuid = ctx.params.clientUuid;

    await this.organizationService.createClientFacebookAdAccount(clientUuid, body.adAccountId);

    ctx.body = { message: "Client Facebook Ad Account created successfully." };
    ctx.status = 200;
  }

  private async deleteClientFacebookAdAccount(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const adAccountId = ctx.params.adAccountId;

    await this.organizationService.deleteClientFacebookAdAccount(clientUuid, adAccountId);

    ctx.body = { message: "Client Facebook Ad Account deleted successfully." };
    ctx.status = 200;
  }

  private async getSlackAvailableConversations(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;

    const conversations = await this.organizationService.getAvailableSlackConversations(clientUuid);

    ctx.body = conversations;
    ctx.status = 200;
  }

  private async isSlackWorkspaceConnected(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const isConnected = await this.organizationService.isSlackWorkspaceConnected(clientUuid);

    ctx.body = { isConnected };
    ctx.status = 200;
  }

  private async setSlackConversationId(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const body = ctx.request.body as SetSlackConversationIdRequest;

    await this.organizationService.setSlackConversationId(clientUuid, body.conversationId);

    ctx.body = { message: "Slack conversation ID set successfully." };
    ctx.status = 200;
  }

  private async sendSlackMessage(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const body = ctx.request.body as SendMessageToSlackRequest;

    await this.organizationService.sendSlackMessage(clientUuid, body.message);

    ctx.body = { message: "Message sent to Slack successfully." };
    ctx.status = 200;
  }

  private async getConnectedSlackWorkspaces(ctx: Context) {
    const user = ctx.state.user;

    const workspaces = await this.organizationService.getConnectedSlackWorkspaces(user.activeOrganization);

    ctx.body = workspaces;
    ctx.status = 200;
  }

  private async setSlackWorkspaceToken(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const body = ctx.request.body as SetSlackWorkspaceTokenRequest;

    await this.organizationService.setSlackWorkspaceToken(clientUuid, body.tokenId);

    ctx.body = { message: "Slack workspace token set successfully." };
    ctx.status = 200;
  }

  private async sendMessageWithFileToSlack(ctx: Context) {
    const clientUuid = ctx.params.clientUuid;
    const body = ctx.request.body as SendMessageWithFileToSlackRequest;

    await this.organizationService.sendMessageWithFileToSlack(clientUuid, body.message, body.pdfBuffer, body.fileName);

    ctx.body = { message: "Message sent to Slack successfully." };
    ctx.status = 200;
  }

}
