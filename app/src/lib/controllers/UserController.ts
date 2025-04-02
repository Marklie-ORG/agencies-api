import Router from "koa-router";
import type { Context } from "koa";
import type { User } from "../entities/User.js";
import { em } from "../db/config/DB.js";
import type { SetActiveOrganizationRequest } from "../interfaces/UserInterfaces.js";
import { Organization } from "../entities/Organization.js";

export class UserController extends Router {
  constructor() {
    super({ prefix: "/api/user" });
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.post("/active-organization", this.setActiveOrganization);
  }

  private async setActiveOrganization(ctx: Context) {
    const body = ctx.request.body as SetActiveOrganizationRequest;
    const user: User = ctx.state.user as User;

    if (!body.activeOrganizationUuid) {
      ctx.throw(400, "Active organization ID is required.");
    }

    user.activeOrganization = em.getReference(
      Organization,
      body.activeOrganizationUuid,
    );
    await em.persistAndFlush(user);

    ctx.body = { message: "Active organization updated successfully." };
    ctx.status = 200;
  }
}
