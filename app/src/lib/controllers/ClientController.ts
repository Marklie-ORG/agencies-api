import Router from "koa-router";
import type { Context } from "koa";
import type { CreateClientRequest, CreateClientFacebookAdAccountRequest } from "markly-ts-core/dist/lib/interfaces/ClientInterfaces.js";
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
    this.get("/:clientUuid/ad-accounts", this.getClientFacebookAdAccounts.bind(this));
    this.post("/:clientUuid/ad-accounts", this.createClientFacebookAdAccount.bind(this));
    this.delete("/:clientUuid/ad-accounts/:adAccountId", this.deleteClientFacebookAdAccount.bind(this));
  }

  private async createClient(ctx: Context) {
    const body = ctx.request.body as CreateClientRequest;
    const user = ctx.state.user;

    const client = await this.organizationService.createOrganizationClient(body.name, user.activeOrganization.uuid);

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

    const clients = await this.organizationService.getOrganizationClients(user.activeOrganization);

    ctx.body = clients;
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

}

