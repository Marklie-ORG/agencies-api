import Router from "@koa/router";
import type { Context } from "koa";
import type {
  CreateOrganizationRequest,
  UseInviteCodeRequest,
  ShareClientDatabaseRequest,
  VerifyClientAccessRequest,
  RequestClientAccessRequest
} from "marklie-ts-core/dist/lib/interfaces/OrganizationInterfaces.js";
import { OrganizationService } from "../services/OrganizationService.js";
import { CookiesWrapper } from "marklie-ts-core/dist/lib/classes/CookiesWrapper.js";

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
    this.get("/invite-codes", this.listInviteCodes.bind(this));
    this.get("/:uuid/logs", this.getLogs.bind(this));
    this.get(
      "/client-access-requests",
      this.getClientAccessRequests.bind(this),
    );
    this.post("/invite-code", this.useInviteCode.bind(this));
    this.get("/scheduling-options", this.getSchedulingOptions.bind(this));
    this.post("/share-client-database", this.shareClientDatabase.bind(this));
    this.post(
      "/verify-client-access",
      this.verifyClientAccess.bind(this),
    );
    this.post(
      "/request-client-access",
      this.requestClientAccess.bind(this),
    );
  }

  private async createOrganization(ctx: Context) {
    const body = ctx.request.body as CreateOrganizationRequest;
    const user = ctx.state.user;

    await this.organizationService.createOrganization(body.name, user);

    ctx.body = { message: "Organization created successfully." };
    ctx.status = 200;
  }

  private async getLogs(ctx: Context) {
    const orgUuid = ctx.params.uuid;

    ctx.body = await this.organizationService.getLogs(orgUuid);
    ctx.status = 200;
  }

  private async generateInviteCode(ctx: Context) {
    const user = ctx.state.user;

    const inviteCode = await this.organizationService.generateInviteCode(user);

    ctx.body = { inviteCode };
    ctx.status = 200;
  }

  private async listInviteCodes(ctx: Context) {
    const user = ctx.state.user;
    const invites = await this.organizationService.listInviteCodes(user);
    ctx.body = invites;
    ctx.status = 200;
  }

  private async useInviteCode(ctx: Context) {
    const user = ctx.state.user;
    const body = ctx.request.body as UseInviteCodeRequest;

    await this.organizationService.useInviteCode(body.code, user);

    ctx.body = { message: "Invite code used successfully." };
    ctx.status = 200;
  }

  private async getSchedulingOptions(ctx: Context) {
    const user = ctx.state.user;

    ctx.body = await this.organizationService.getSchedulingOptions(
      user.activeOrganization.uuid,
    );
    ctx.status = 200;
  }

  private async shareClientDatabase(ctx: Context) {
    const user = ctx.state.user;
    const body = ctx.request.body as ShareClientDatabaseRequest;

    await this.organizationService.sendClientAccessEmail(body.clientUuid, body.emails, user);
    ctx.body = { message: "Client access email sent successfully." };
    ctx.status = 200;
  }

  private async getClientAccessRequests(ctx: Context) {
    const user = ctx.state.user;

    ctx.body = await this.organizationService.getClientAccessRequests(
      user.activeOrganization.uuid,
    );
    ctx.status = 200;
  }

  private async verifyClientAccess(ctx: Context) {
    const body = ctx.request.body as VerifyClientAccessRequest;

    const refreshToken = await this.organizationService.verifyClientAccess(body.token);

    const cookies = ctx.state.cookiesWrapper as CookiesWrapper;
    cookies.set(
      "refreshToken",
      refreshToken,
      CookiesWrapper.defaultRefreshCookieOptions(),
    );

    ctx.body = { message: "Client access verified successfully." };
    ctx.status = 200;
  }

  private async requestClientAccess(ctx: Context) {
    const body = ctx.request.body as RequestClientAccessRequest;

    await this.organizationService.requestClientAccess({
      email: body.email,
      ...(body.reportUuid && { reportUuid: body.reportUuid }),
      ...(body.clientUuid && { clientUuid: body.clientUuid }),
    });

    ctx.body = { message: "Client access requested successfully." };
    ctx.status = 200;
  }

}
