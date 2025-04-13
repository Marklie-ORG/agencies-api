import Router from "koa-router";
import type { Context } from "koa";
import type { CreateOrganizationRequest, UseInviteCodeRequest } from "markly-ts-core/dist/lib/interfaces/OrganizationInterfaces.js";
import { Database, Organization, OrganizationMember } from "markly-ts-core";
import { UserService } from "../services/UserService.js";
import { OrganizationRole } from "markly-ts-core/dist/lib/enums/enums.js";
import { OrganizationService } from "../services/OrganizationService.js";
const database = await Database.getInstance();

export class OrganizationController extends Router {
  private readonly userService: UserService;
  private readonly organizationService: OrganizationService;
  constructor() {
    super({ prefix: "/api/organizations" });
    this.userService = new UserService();
    this.organizationService = new OrganizationService();
    this.setUpRoutes();
  } 

  private setUpRoutes() {
    this.post("/organization", (ctx) => this.createOrganization(ctx));
    this.get("/invite-code", (ctx) => this.generateInviteCode(ctx));
    this.post("/invite-code", (ctx) => this.useInviteCode(ctx));
  }

  private async createOrganization(ctx: Context) {
    const body = ctx.request.body as CreateOrganizationRequest;
    const user = ctx.state.user;

    const newOrganization = database.em.create(Organization, {
        name: body.name,
        members: [],
        clients: []
    });

    await this.userService.setActiveOrganization( // setting the active organization in user table
        newOrganization.uuid,
        user,
      );

    // Create organization member
    const organizationMember = database.em.create(OrganizationMember, {
      organization: newOrganization,
      user: user,
      role: OrganizationRole.OWNER // the creator should be an owner
    });

    await database.em.persistAndFlush([newOrganization, organizationMember]);

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
