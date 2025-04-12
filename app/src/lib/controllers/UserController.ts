import Router from "koa-router";
import type { Context } from "koa";
import { UserService } from "../services/UserService.js";
import type { SetActiveOrganizationRequest, SetNameRequest } from "markly-ts-core/dist/lib/interfaces/UserInterfaces.js";
import { User } from "markly-ts-core";

export class UserController extends Router {
  private readonly userService: UserService;
  constructor() {
    super({ prefix: "/api/user" });
    this.userService = new UserService();
    this.setUpRoutes();
  } 

  private setUpRoutes() {
    this.post("/active-organization", (ctx) => this.setActiveOrganization(ctx));
    this.post("/name", (ctx) => this.setName(ctx));
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

  private async setName(ctx: Context) {
    const body = ctx.request.body as SetNameRequest;
    const user: User = ctx.state.user as User;

    await this.userService.setName(
      body.firstName,
      body.lastName,
      user, 
    );

    ctx.body = { message: "Name updated successfully." };
    ctx.status = 200;
  }
}
