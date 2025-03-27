import { ZodSchema } from "zod";
import type { Context, Request } from "koa";
import {
  LoginRequestSchema,
  RegistrationRequestSchema,
  ReportsQueryParamsSchema,
  ScheduleReportsRequestSchema,
} from "../../schemas/ZodSchemas.js";

const schemaMap: { [key: string]: ZodSchema<any> } = {
  "/api/auth/register": RegistrationRequestSchema,
  "/api/auth/login": LoginRequestSchema,
  "/api/reports/schedule": ScheduleReportsRequestSchema,
  "/api/reports/": ReportsQueryParamsSchema,
};

export class Validator {
  public static validateBody(request: Request) {
    const schema = schemaMap[request.url];
    if (!schema) {
      throw new Error(`No validation schema defined for URL ${request.url}`);
    }
    schema.parse(request.body);
  }

  public static validateQuery(request: Request) {
    const schema = schemaMap[request.url];
    if (!schema) {
      throw new Error(`No validation schema defined for URL ${request.url}`);
    }
    schema.parse(request.query);
  }

  public static validateRequest(ctx: Context) {
    if (ctx.request.method !== "GET") {
      this.validateBody(ctx.request);
    }

    if (ctx.request.querystring.length > 0) {
      this.validateQuery(ctx.request);
    }
  }
}
