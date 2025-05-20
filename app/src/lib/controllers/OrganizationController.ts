import Router from "koa-router";
import type { Context } from "koa";
import type { CreateOrganizationRequest, UseInviteCodeRequest } from "marklie-ts-core/dist/lib/interfaces/OrganizationInterfaces.js";
import { OrganizationService } from "../services/OrganizationService.js";

export class OrganizationController extends Router {
  private readonly organizationService: OrganizationService;
  constructor() {
    super({ prefix: "/api/organizations" });
    this.organizationService = new OrganizationService();
    this.setUpRoutes();
  } 

  private setUpRoutes() {
    this.post("/", this.createOrganization.bind(this));
    this.get("/invite-code", this.generateInviteCode.bind(this));
    this.post("/invite-code", this.useInviteCode.bind(this));
  }

  private async createOrganization(ctx: Context) {
    const body = ctx.request.body as CreateOrganizationRequest;
    const user = ctx.state.user;

    await this.organizationService.createOrganization(body.name, user);

    ctx.body = { message: "Organization created successfully." };
    ctx.status = 200;
  }

  private async generateInviteCode(ctx: Context) {
    const user = ctx.state.user;

    const inviteCode = await this.organizationService.generateInviteCode(user);

    ctx.body = { inviteCode };
    ctx.status = 200;
  }

  private async useInviteCode(ctx: Context) {
    const user = ctx.state.user;
    const body = ctx.request.body as UseInviteCodeRequest;

    await this.organizationService.useInviteCode(body.code, user);

    ctx.body = { message: "Invite code used successfully." };
    ctx.status = 200;
  }

}
