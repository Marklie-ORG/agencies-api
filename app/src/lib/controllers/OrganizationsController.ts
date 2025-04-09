import Router from "koa-router";
import type { Context } from "koa";
import { OrganizationClient } from "../entities/OrganizationClient.js";
import { em } from "../db/config/DB.js";
import { roleMiddleware } from "../middlewares/RolesMiddleware.js";
import { OrganizationRole } from "../enums/enums.js";

export class OrganizationsController extends Router {
  constructor() {
    super({ prefix: "/api/organizations" });
    this.setUpRoutes();
  }

  private setUpRoutes() {
    // Create a new client
    this.post("/", roleMiddleware(OrganizationRole.OWNER), this.createOrganization);
  }

  private async createOrganization(ctx: Context) {
    const organizationId = ctx.state.user.organizationId;
    const clientData = ctx.request.body as OrganizationClient;

    const client = em.create(OrganizationClient, {
      ...clientData,
      organization: organizationId
    });

    await em.persistAndFlush(client);
    ctx.body = client;
    ctx.status = 201;
  }

}
