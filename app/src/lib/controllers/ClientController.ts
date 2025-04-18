import Router from "koa-router";
import type { Context } from "koa";
import type { CreateClientRequest } from "markly-ts-core/dist/lib/interfaces/ClientInterfaces.js";
import { Database, OrganizationClient } from "markly-ts-core";
const database = await Database.getInstance();

export class ClientController extends Router {
  
  constructor() {
    super({ prefix: "/api/clients" });
    this.setUpRoutes();
  } 

  private setUpRoutes() {
    this.post("/client", (ctx) => this.createClient(ctx));
    this.get("/clients", (ctx) => this.getClients(ctx));
  }

  private async createClient(ctx: Context) {
    const body = ctx.request.body as CreateClientRequest;
    const user = ctx.state.user;

    console.log(user)

    const newClient = database.em.create(OrganizationClient, {
        name: body.name,
        organization: user.activeOrganization
    });

    await database.em.persistAndFlush(newClient);

    ctx.body = { message: "Client created successfully." };
    ctx.status = 200;
  }

  private async getClients(ctx: Context) {
    const user = ctx.state.user;

    const clients = await database.em.find(OrganizationClient, { organization: user.activeOrganization });

    ctx.body = clients;
    ctx.status = 200;
  }

}

