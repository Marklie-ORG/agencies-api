import Router from "koa-router";
import type { Context } from "koa";
import { AdAccountsService } from "lib/services/AdAccountsService.js";
import type { User } from "marklie-ts-core";

export class AdAccountsController extends Router {
  private adAccountsService = new AdAccountsService();
  constructor() {
    super({ prefix: "/api/ad-accounts" });
    this.adAccountsService = new AdAccountsService();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.get("/businesses-hierarchy", this.getBusinessesHierarchy.bind(this));
  }

  private async getBusinessesHierarchy(ctx: Context) {
    try {
      const user = ctx.state.user as User;
      const organizationUuid = user.activeOrganization.uuid;

      const businessesHierarchy = await this.adAccountsService.getAvailableAdAccounts(organizationUuid);

      ctx.body = businessesHierarchy;
      ctx.status = 200;

    } catch (error) {
      console.error(error);
      ctx.body = {
        message: "Internal server error",
        error: error,
      };
      ctx.status = 500;
    }
  }

}
