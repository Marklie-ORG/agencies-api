import Router from "koa-router";
import type { Context } from "koa";
import type {
  LoginRequestBody,
  RegistrationRequestBody,
} from "../interfaces/AuthInterfaces.js";
import type { User } from "../entities/User.js";
import { AuthenticationUtil } from "../utils/AuthenticationUtil.js";

const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

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
    
    // Set refresh token as HTTP-only cookie
    ctx.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? 'your-domain.com' : undefined
    });

    ctx.body = { accessToken };
    ctx.status = 200;
  }

  private async refresh(ctx: Context) {
    const refreshToken = ctx.cookies.get('refreshToken');

    if (!refreshToken) {
      ctx.status = 401;
      ctx.body = { error: 'No refresh token provided' };
      return;
    }

    const token: string | false | null =
      await AuthenticationUtil.verifyRefreshToken(refreshToken);
    ctx.body = { accessToken: token };
    ctx.status = 200;
  }

  private async registration(ctx: Context) {
    const body: RegistrationRequestBody = ctx.request
      .body as RegistrationRequestBody;

    const { accessToken, refreshToken } = await AuthenticationUtil.register(body);
    
    // Set refresh token as HTTP-only cookie
    ctx.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? 'your-domain.com' : undefined
    });

    ctx.body = { accessToken };
    ctx.status = 201;
  }
}
