import Router from "koa-router";
import type { Context } from "koa";
import type { ReportScheduleRequest } from "../interfaces/ReportsInterfaces.js";
import { roleMiddleware } from "../middlewares/RolesMiddleware.js";
import { OrganizationRole } from "../enums/enums.js";
import type { User } from "../entities/User.js";
import { ReportsService } from "../services/ReportsService.js";

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
      roleMiddleware(OrganizationRole.OWNER),
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
