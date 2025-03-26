import type { Context, Next } from "koa";
import { AuthenticationUtil } from "../utils/AuthenticationUtil.js";

async function authMiddleware(ctx: Context, next: Next) {
  try {
    const authHeader = ctx.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.status = 401;
      ctx.body = { message: "Authorization token missing or malformed" };
      return;
    }

    const token = authHeader.split(" ")[1];

    const user = await AuthenticationUtil.verifyTokenAndFetchUser(token);

    if (!user) {
      ctx.status = 401;
      ctx.body = { message: "User not found" };
      return;
    }

    ctx.state.user = user;

    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { message: "Invalid or expired token" };
  }
}

export default authMiddleware;
