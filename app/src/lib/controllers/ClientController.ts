import Router from "koa-router";
import type { Context } from "koa";
import type { CreateClientRequest } from "markly-ts-core/dist/lib/interfaces/ClientInterfaces.js";
import { OrganizationService } from "lib/services/OrganizationService.js";

export class ClientController extends Router {
  private readonly organizationService: OrganizationService;
  constructor() {
    super({ prefix: "/api/clients" });
    this.organizationService = new OrganizationService();
    this.setUpRoutes();
  } 

  private setUpRoutes() {
    this.post("/client", this.createClient.bind(this));
    this.get("/clients", this.getClients.bind(this));
  }

  private async createClient(ctx: Context) {
    const body = ctx.request.body as CreateClientRequest;
    const user = ctx.state.user;

    await this.organizationService.createOrganizationClient(body.name, user.activeOrganization.uuid);

    ctx.body = { message: "Client created successfully." };
    ctx.status = 200;
  }

  private async getClients(ctx: Context) {
    const user = ctx.state.user;

    const clients = await this.organizationService.getOrganizationClients(user.activeOrganization);

    ctx.body = clients;
    ctx.status = 200;
  }

}

