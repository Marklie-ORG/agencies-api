import type { RegistrationRequestBody } from "../interfaces/AuthInterfaces.js";
import { z } from "zod";
import type { Request } from "koa";

export class Validator {
  public static validateRegistrationRequest(body: RegistrationRequestBody) {
    const RegistrationRequestSchema = z.object({
      email: z.string().email({ message: "Invalid email address" }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
      // firstName: z.string().min(8, { message: "Password must be at least 8 characters long" }),
      // lastName: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    });

    return RegistrationRequestSchema.parse(body);
  }

  public static validateReportsQueryParams(query: any) {
    console.log(query);
    const ReportsQueryParamsSchema = z.object({
      datePreset: z.string().min(1, { message: "datePreset is required" }),
      organizationName: z
        .string()
        .min(1, { message: "organizationName is required" }),
    });

    return ReportsQueryParamsSchema.parse(query);
  }

  public static validateUrlParams(params: any) {
    const UrlParamsSchema = z.object({
      id: z.string().min(1, { message: "ID is required" }),
    });

    return UrlParamsSchema.parse(params);
  }

  public static validateBody(request: Request) {
    switch (request.url) {
      case "/register":
        this.validateRegistrationRequest(
          request.body as RegistrationRequestBody,
        );
        break;
    }
  }

  public static validateQuery(request: Request) {
    switch (request.url) {
      case "/api/reports":
        this.validateReportsQueryParams(request.query);
        break;
    }
  }

  public static validateUrl(request: Request) {
    switch (request.url) {
      case "/users/:id":
        // this.validateUrlParams(request.params);
        break;
    }
  }
}
