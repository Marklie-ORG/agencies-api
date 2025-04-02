import type { Context, Next } from "koa";
import { ZodError } from "zod";
import { Validator } from "../utils/Validator.js";
import { Log } from "../utils/Logger.js";

const logger: Log = Log.getInstance().extend("validation-middleware");

export const ValidationMiddleware = () => {
  return async (ctx: Context, next: Next) => {
    try {
      Validator.validateRequest(ctx);

      await next();
    } catch (e) {
      if (e instanceof ZodError) {
        ctx.status = 400;
        ctx.body = {
          errors: e.errors.map((error) => ({
            field: error.path.join("."),
            message: error.message,
          })),
        };
      } else {
        logger.catchError(e);
        ctx.status = 500;
        ctx.body = { message: (e as Error).message };
      }
    }
  };
};
