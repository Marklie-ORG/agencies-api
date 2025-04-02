import { ZodSchema } from "zod";
import type { Context, Request } from "koa";
import {
  LoginRequestSchema,
  RegistrationRequestSchema,
  ReportsQueryParamsSchema,
  ScheduleReportsRequestSchema,
  AdAccountsBusinessesRequestSchema,
  RefreshRequestSchema,
  SetActiveOrganizationSchema,
} from "../../schemas/ZodSchemas.js";

const schemaMap: { [key: string]: ZodSchema<any> } = {
  "/api/auth/register": RegistrationRequestSchema,
  "/api/auth/login": LoginRequestSchema,
  "/api/auth/refresh": RefreshRequestSchema,

  "/api/reports/schedule": ScheduleReportsRequestSchema,
  "/api/reports/": ReportsQueryParamsSchema,

  "/api/ad-accounts/businesses": AdAccountsBusinessesRequestSchema,

  "/api/user/active-organization": SetActiveOrganizationSchema,
};

export class Validator {
  private static getPathFromUrl(url: string): string {
    // Remove query parameters from URL
    return url.split("?")[0];
  }

  public static validateBody(request: Request) {
    const path = this.getPathFromUrl(request.url);
    const schema = schemaMap[path];
    if (!schema) {
      throw new Error(`No validation schema defined for URL ${path}`);
    }
    schema.parse(request.body);
  }

  public static validateQuery(request: Request) {
    const path = this.getPathFromUrl(request.url);
    const schema = schemaMap[path];
    if (!schema) {
      throw new Error(`No validation schema defined for URL ${path}`);
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
