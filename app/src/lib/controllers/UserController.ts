import Router from "@koa/router";
import type { Context } from "koa";
import { UserService } from "../services/UserService.js";
import type {
  ChangeEmailRequest,
  ChangePasswordRequest,
  HandleFacebookLoginRequest,
  HandleSlackLoginRequest,
  SendFeedbackRequest,
  SendPasswordRecoveryEmailRequest,
  SetActiveOrganizationRequest,
  SetNameRequest,
  VerifyEmailChangeRequest,
  VerifyPasswordRecoveryRequest,
} from "marklie-ts-core/dist/lib/interfaces/UserInterfaces.js";
import {
  AuthenticationUtil,
  CookiesWrapper,
  Database,
  SlackApi,
  SlackService,
  TokenService,
  User,
} from "marklie-ts-core";
import { FacebookApi } from "lib/apis/FacebookApi.js";
import { AgencyService } from "lib/services/AgencyService.js";
import { ClientTokenType } from "marklie-ts-core/dist/lib/enums/enums.js";
import { ClientService } from "../services/ClientService.js";

const database = await Database.getInstance();

type ImpersonateUserRequest = { email: string };

export class UserController extends Router {
  private readonly userService: UserService;
  private readonly agencyService: AgencyService;
  private readonly clientService: ClientService;

  constructor() {
    super({ prefix: "/api/user" });
    this.userService = new UserService();
    this.agencyService = new AgencyService();
    const tokenService = new TokenService();
    const slackService = new SlackService(tokenService);
    this.clientService = new ClientService(slackService, tokenService);
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.post("/active-organization", this.setActiveOrganization.bind(this));
    this.post("/name", this.setName.bind(this));
    this.post("/handle-facebook-login", this.handleFacebookLogin.bind(this));
    this.post("/handle-slack-login", this.handleSlackLogin.bind(this));
    this.post("/send-change-email-email", this.sendChangeEmailEmail.bind(this));
    this.post("/verify-email-change", this.verifyEmailChange.bind(this));
    this.post("/change-password", this.changePassword.bind(this));
    this.post(
      "/send-password-recovery-email",
      this.sendPasswordRecoveryEmail.bind(this),
    );
    this.post(
      "/verify-password-recovery",
      this.verifyPasswordRecovery.bind(this),
    );
    this.post("/feedback", this.sendFeedback.bind(this));
    this.get("/me", this.me.bind(this));
    this.post("/impersonate", this.impersonate.bind(this));
  }

  private async me(ctx: Context) {
    ctx.body = await database.em.findOne(
      User,
      { uuid: ctx.state.user.uuid },
      {
        populate: ["activeOrganization"],
        fields: [
          "uuid",
          "email",
          "firstName",
          "lastName",
          "activeOrganization.*",
        ],
      },
    );
    ctx.status = 200;
  }

  private async sendFeedback(ctx: Context) {
    const user: User = ctx.state.user as User;
    const body = ctx.request.body as SendFeedbackRequest;
    await this.userService.sendFeedback(body.message, user);
    ctx.body = { message: "Feedback received. Thank you!" };
    ctx.status = 200;
  }

  private async verifyEmailChange(ctx: Context) {
    const body = ctx.request.body as VerifyEmailChangeRequest;

    await this.userService.verifyEmailChange(body.token);

    ctx.body = { message: "Email changed successfully." };
    ctx.status = 200;
  }

  private async sendChangeEmailEmail(ctx: Context) {
    const body = ctx.request.body as ChangeEmailRequest;
    const user: User = ctx.state.user as User;

    await this.userService.sendChangeEmailEmail(
      body.email,
      body.password,
      user,
    );

    ctx.body = { message: "Email sent successfully." };
    ctx.status = 200;
  }

  private async sendPasswordRecoveryEmail(ctx: Context) {
    const body = ctx.request.body as SendPasswordRecoveryEmailRequest;

    await this.userService.sendPasswordRecoveryEmail(body.email);

    ctx.body = { message: "Email sent successfully." };
    ctx.status = 200;
  }

  private async verifyPasswordRecovery(ctx: Context) {
    const body = ctx.request.body as VerifyPasswordRecoveryRequest;

    await this.userService.verifyPasswordRecovery(body.token, body.newPassword);

    ctx.body = { message: "Password recovered successfully." };
    ctx.status = 200;
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

    await this.userService.setName(body.firstName, body.lastName, user);

    ctx.body = { message: "Name updated successfully." };
    ctx.status = 200;
  }

  private async handleFacebookLogin(ctx: Context) {
    const body = ctx.request.body as HandleFacebookLoginRequest;
    const user: User = ctx.state.user as User;

    const facebookApi = new FacebookApi();

    const data = await facebookApi.handleFacebookLogin(
      body.code,
      body.redirectUri,
    );

    if (!data) {
      ctx.body = { message: "Failed to retrieve access token." };
      ctx.status = 400;
      return;
    }

    const accessToken = data.access_token;

    await this.agencyService.saveAgencyToken(user, accessToken);

    ctx.body = { message: "Access token retrieved successfully." };
    ctx.status = 200;
  }

  private async handleSlackLogin(ctx: Context) {
    const body = ctx.request.body as HandleSlackLoginRequest;

    const slackApi = new SlackApi();

    const data = await slackApi.handleSlackLogin(body.code, body.redirectUri);

    await this.clientService.createToken(
      body.organizationClientId,
      data.access_token,
      ClientTokenType.SLACK,
    );

    ctx.body = { message: "Access token retrieved successfully." };
    ctx.status = 200;
  }

  private async changePassword(ctx: Context) {
    const body = ctx.request.body as ChangePasswordRequest;
    const user: User = ctx.state.user as User;

    await this.userService.changePassword(
      body.password,
      body.newPassword,
      user,
    );

    ctx.body = { message: "Password changed successfully." };
    ctx.status = 200;
  }

  private async impersonate(ctx: Context) {
    const body = ctx.request.body as ImpersonateUserRequest;
    const adminUser: User = ctx.state.user as User;

    const isAdmin = (adminUser as any)?.role === "admin";
    if (!isAdmin) {
      ctx.body = { message: "Forbidden: Admin role required" };
      ctx.status = 403;
      return;
    }

    if (!body.email) {
      ctx.body = { message: "Email is required" };
      ctx.status = 400;
      return;
    }

    const target = await database.em.findOne(User, { email: body.email });
    if (!target) {
      ctx.body = { message: "Target user not found" };
      ctx.status = 404;
      return;
    }

    const cleaned = await AuthenticationUtil.convertPersistedToUser(target);
    const refreshToken = AuthenticationUtil.signRefreshToken(cleaned);

    const cookies = ctx.state.cookiesWrapper as CookiesWrapper;
    cookies.set(
      "refreshToken",
      refreshToken,
      CookiesWrapper.defaultRefreshCookieOptions(),
    );

    ctx.body = { message: "Impersonation refresh token issued" };
    ctx.status = 200;
  }
}
