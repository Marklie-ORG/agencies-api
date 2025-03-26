import Router from "koa-router";
import type { Context } from "koa";
import { ReportsUtil } from "../utils/ReportsUtil.js";
import { SchedulingOption } from "../entities/SchedulingOption.js";
import type { ReportScheduleRequest } from "../interfaces/ReportsInterfaces.js";
import { CronUtil } from "../utils/CronUtil.js";
import { OrganizationClient } from "../entities/OrganizationClient.js";
import { em } from "../db/config/DB.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import { queue } from "../utils/BullMQWrapper.js";

export class ReportsController extends Router {
  constructor() {
    super({ prefix: "/api/reports" });
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.get("/", this.getReport);
    this.post("/schedule", authMiddleware, this.scheduleReports);
  }

  private async getReport(ctx: Context) {
    const datePreset = ctx.query.datePreset as string;
    const organizationName = ctx.query.organizationName as string;

    ctx.body = await ReportsUtil.getAllReportData(organizationName, datePreset);
    ctx.status = 200;
  }

  private async scheduleReports(ctx: Context) {
    const scheduleOption: ReportScheduleRequest = ctx.request
      .body as ReportScheduleRequest;

    const schedule = new SchedulingOption();

    const cronExpression =
      CronUtil.convertScheduleRequestToCron(scheduleOption);

    schedule.cronExpression =
      CronUtil.convertScheduleRequestToCron(scheduleOption);
    schedule.client = em.getReference(
      OrganizationClient,
      scheduleOption.clientUuid,
    );

    schedule.reportType = "defaultReport";
    schedule.jobData = scheduleOption as any;
    schedule.timezone = "UTC";

    await queue.addScheduledJob("user.organization", {}, cronExpression);

    await em.persistAndFlush(schedule);

    ctx.body = {
      message: "Report schedule created successfully",
      cronExpression,
    };
    ctx.status = 201;
  }
}
