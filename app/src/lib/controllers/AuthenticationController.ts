import Router from "koa-router";
import type { Context } from "koa";
import { AuthenticationUtil, CookiesWrapper, User } from "marklie-ts-core";
import type {
  LoginRequestBody,
  RegistrationRequestBody,
} from "marklie-ts-core/dist/lib/interfaces/AuthInterfaces.js";

export class AuthController extends Router {
  constructor() {
    super({ prefix: "/api/auth" });
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.post("/login", this.login.bind(this));
    this.post("/register", this.registration.bind(this));
    this.get("/me", this.me.bind(this));
    this.post("/refresh", this.refresh.bind(this));
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
