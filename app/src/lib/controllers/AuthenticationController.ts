import Router from "koa-router";
import type { Context } from "koa";
import type {
  LoginRequestBody,
  RegistrationRequestBody,
} from "../interfaces/AuthInterfaces.js";
import type { User } from "../entities/User.js";
import { AuthenticationUtil } from "../utils/AuthenticationUtil.js";
import { CookiesWrapper } from "../classes/CookiesWrapper.js";

export class AuthController extends Router {
  constructor() {
    super({ prefix: "/api/auth" });
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.post("/login", this.login);
    this.post("/register", this.registration);
    this.get("/me", this.me);
    this.post("/refresh", this.refresh);
  }

  private async me(ctx: Context) {
    const user: User = ctx.state.user as User;

    ctx.body = await AuthenticationUtil.convertPersistedToUser(user);
    ctx.status = 200;
  }

  private async login(ctx: Context) {
    const body: LoginRequestBody = ctx.request.body as LoginRequestBody;
    const { accessToken, refreshToken } = await AuthenticationUtil.login(body);

    const cookies = ctx.state.cookiesWrapper as CookiesWrapper;
    cookies.set(
      "refreshToken",
      refreshToken,
      CookiesWrapper.defaultRefreshCookieOptions(),
    );

    ctx.body = { accessToken };
    ctx.status = 200;
  }

  private async refresh(ctx: Context) {
    const cookies = ctx.state.cookiesWrapper as CookiesWrapper;
    const refreshToken = cookies.get("refreshToken");

    if (!refreshToken) {
      ctx.throw(401, "No refresh token provided");
    }

    const token: string | false | null =
      await AuthenticationUtil.verifyRefreshToken(refreshToken);
    ctx.body = { accessToken: token };
    ctx.status = 200;
  }

  private async registration(ctx: Context) {
    const body: RegistrationRequestBody = ctx.request
      .body as RegistrationRequestBody;

    const { accessToken, refreshToken } =
      await AuthenticationUtil.register(body);

    const cookies = ctx.state.cookiesWrapper as CookiesWrapper;
    cookies.set(
      "refreshToken",
      refreshToken,
      CookiesWrapper.defaultRefreshCookieOptions(),
    );

    ctx.body = { accessToken };
    ctx.status = 201;
  }
}
