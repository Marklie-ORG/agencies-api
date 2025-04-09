import type { Context, Next } from "koa";
import { ZodError } from "zod";
import { Log } from "../classes/Logger.js";

const logger: Log = Log.getInstance().extend("error-middleware");

export const ErrorMiddleware = () => {
  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (e) {
      logger.catchError(e);
      if (e instanceof ZodError) {
        ctx.status = 400;
        ctx.body = {
          error: "Validation Error",
          details: e.errors.map((error) => ({
            field: error.path.join("."),
            message: error.message,
          })),
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          message: e instanceof Error ? e.message : "Internal server error" + e,
        };
      }
      logger.error("ErrorMiddleware caught an error:", e);
    }
  };
};
