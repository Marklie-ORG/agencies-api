import Koa from "koa";
import cors from "@koa/cors";
import koabodyparser from "koa-bodyparser";
import {
  ActivityLogMiddleware,
  AuthMiddleware,
  CookiesMiddleware,
  ErrorMiddleware,
  SentryMiddleware,
  ValidationMiddleware,
} from "marklie-ts-core";
import { AgencyServiceConfig } from "./lib/config/config.js";

export function applyMiddlewares(app: Koa, config: AgencyServiceConfig) {
  const allowedOrigins = config.get("ALLOWED_ORIGINS");

  const middlewares = [
    ErrorMiddleware(),

    SentryMiddleware(),

    cors({
      origin: (ctx) => {
        const requestOrigin = ctx.request.header.origin;
        return requestOrigin && allowedOrigins.includes(requestOrigin)
          ? requestOrigin
          : allowedOrigins[0];
      },
      credentials: true,
    }),

    koabodyparser(),

    CookiesMiddleware,
    AuthMiddleware([
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/refresh",
      "/api/user/send-password-recovery-email",
      "/api/user/verify-password-recovery",
    ]),

    ValidationMiddleware(),
    ActivityLogMiddleware(),
  ];

  for (const middleware of middlewares) {
    app.use(middleware);
  }
}
