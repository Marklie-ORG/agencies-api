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
  CreateClientRequestSchema,
  CompleteStepParamsSchema,
} from "../../schemas/ZodSchemas.js";

const schemaMap: { [key: string]: ZodSchema<any> } = {
  "/api/auth/register": RegistrationRequestSchema,
  "/api/auth/login": LoginRequestSchema,
  "/api/auth/refresh": RefreshRequestSchema,

  "/api/reports/schedule": ScheduleReportsRequestSchema,
  "/api/reports/": ReportsQueryParamsSchema,

  "/api/ad-accounts/businesses": AdAccountsBusinessesRequestSchema,

  "/api/user/active-organization": SetActiveOrganizationSchema,
  "/api/clients": CreateClientRequestSchema,

  // Onboarding schemas
  "/api/onboarding/complete/:stepId": CompleteStepParamsSchema,
};

export class Validator {
  private static getPathFromUrl(url: string): string {
    // Remove query parameters from URL
    const path = url.split("?")[0];
    
    // Find the matching route pattern from schemaMap
    const routePattern = Object.keys(schemaMap).find(pattern => {
      const patternParts = pattern.split('/');
      const pathParts = path.split('/');
      
      if (patternParts.length !== pathParts.length) return false;
      
      return patternParts.every((part, index) => {
        return part === pathParts[index] || part.startsWith(':');
      });
    });

    return routePattern || path;
  }

  private static extractUrlParams(url: string, pattern: string): Record<string, string> {
    const params: Record<string, string> = {};
    const patternParts = pattern.split('/');
    const urlParts = url.split('?')[0].split('/');

    patternParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1); // Remove the ':' prefix
        params[paramName] = urlParts[index];
      }
    });

    return params;
  }

  public static validateBody(request: Request) {
    const path = this.getPathFromUrl(request.url);
    const schema = schemaMap[path];
    if (!schema) {
      throw new Error(`No validation schema defined for URL ${path}`);
    }

    // If the path contains URL parameters, validate them
    if (path.includes(':')) {
      const params = this.extractUrlParams(request.url, path);
      schema.parse(params);
    } else {
      schema.parse(request.body);
    }
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
