import * as jwt from "jsonwebtoken";
import type { Context, Next } from "koa";
import { em } from "../db/config/DB.js";
import { User } from "../entities/User.js";

async function authMiddleware(ctx: Context, next: Next) {
  try {
    const authHeader = ctx.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.status = 401;
      ctx.body = { message: "Authorization token missing or malformed" };
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, process.env.ACCESS_SECRET as string);

    const user = await em.findOne(User, { uuid: decoded.uuid });

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
