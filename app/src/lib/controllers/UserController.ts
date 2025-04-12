import Router from "koa-router";
import type { Context } from "koa";
import { UserService } from "../services/UserService.js";
import type { SetActiveOrganizationRequest } from "markly-ts-core/dist/lib/interfaces/UserInterfaces.js";
import { User } from "markly-ts-core";

export class UserController extends Router {
  private readonly userService: UserService;
  constructor() {
    super({ prefix: "/api/user" });
    this.userService = new UserService();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.post("/active-organization", this.setActiveOrganization);
  }

  private async setActiveOrganization(ctx: Context) {
    const body = ctx.request.body as SetActiveOrganizationRequest;
    const user: User = ctx.state.user as User;

    await this.userService.setActiveOrganization(
      body.activeOrganizationUuid,
      user,
    );

    ctx.body = { message: "Active organization updated successfully." };
    ctx.status = 200;
  }
}
