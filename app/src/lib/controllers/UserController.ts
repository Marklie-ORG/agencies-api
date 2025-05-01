import Router from "koa-router";
import type { Context } from "koa";
import { UserService } from "../services/UserService.js";
import type { SetActiveOrganizationRequest, SetNameRequest, HandleFacebookLoginRequest, HandleSlackLoginRequest } from "markly-ts-core/dist/lib/interfaces/UserInterfaces.js";
import { User } from "markly-ts-core";
import { FacebookApi } from "lib/apis/FacebookApi.js";
import { AgencyService } from "lib/services/AgencyService.js";
import { SlackApi } from "lib/apis/SlackApi.js";
import { OrganizationService } from "lib/services/OrganizationService.js";
import { ClientTokenType } from "markly-ts-core/dist/lib/enums/enums.js";
export class UserController extends Router {
  private readonly userService: UserService;
  private readonly agencyService: AgencyService;
  private readonly organizationService: OrganizationService;
  constructor() {
    super({ prefix: "/api/user" });
    this.userService = new UserService();
    this.agencyService = new AgencyService();
    this.organizationService = new OrganizationService();
    this.setUpRoutes();
  } 

  private setUpRoutes() {
    this.post("/active-organization", this.setActiveOrganization.bind(this));
    this.post("/name", this.setName.bind(this));
    this.post("/handle-facebook-login", this.handleFacebookLogin.bind(this));
    this.post("/handle-slack-login", this.handleSlackLogin.bind(this));
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

  private async handleFacebookLogin(ctx: Context) {
    const body = ctx.request.body as HandleFacebookLoginRequest;
    const user: User = ctx.state.user as User;

    const facebookApi = new FacebookApi();  

    const data = await facebookApi.handleFacebookLogin(
      body.code,
      body.redirectUri
    );

    const accessToken = data.access_token;

    this.agencyService.saveAgencyToken(user, accessToken);

    ctx.body = { message: "Access token retrieved successfully." };
    ctx.status = 200;
  }

  private async handleSlackLogin(ctx: Context) {
    const body = ctx.request.body as HandleSlackLoginRequest;

    const slackApi = new SlackApi();  

    const data = await slackApi.handleSlackLogin(
      body.code,
      body.redirectUri
    );

    console.log(data);

    this.organizationService.createClientToken(data.access_token, body.organizationClientId, ClientTokenType.SLACK);

    ctx.body = { message: "Access token retrieved successfully." };
    ctx.status = 200;
  }

}
