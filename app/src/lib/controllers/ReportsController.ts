import Router from "koa-router";
import type { Context } from "koa";
import { ReportsService } from "../services/ReportsService.js";
import { OrganizationRole } from "markly-ts-core/dist/lib/enums/enums.js";
import { RoleMiddleware, User } from "markly-ts-core";
import type { ReportScheduleRequest } from "markly-ts-core/dist/lib/interfaces/ReportsInterfaces.js";

export class ReportsController extends Router {
  private readonly reportsService: ReportsService;

  constructor() {
    super({ prefix: "/api/reports" });
    this.reportsService = new ReportsService();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.get("/", this.getReport);
    this.post(
      "/schedule",
      RoleMiddleware(OrganizationRole.OWNER),
      this.scheduleReports,
    );
  }

  private async getReport(ctx: Context) {
    const organizationUuid = ctx.query.organizationUuid as string;
    const accountId = ctx.query.accountId as string;
    const datePreset = ctx.query.datePreset as string;

    ctx.body = this.reportsService.getReport(
      organizationUuid,
      accountId,
      datePreset,
    );
    ctx.status = 200;
  }

  private async scheduleReports(ctx: Context) {
    const scheduleOption: ReportScheduleRequest = ctx.request
      .body as ReportScheduleRequest;
    const user: User = ctx.state.user as User;

    const cronExpression = this.reportsService.createReport(
      scheduleOption,
      user,
    );

    ctx.body = {
      message: "Report schedule created successfully",
      cronExpression,
    };
    ctx.status = 201;
  }
}
