import Router from "koa-router";
import type { Context } from "koa";
import { SchedulingOption } from "../entities/SchedulingOption.js";
import type { ReportScheduleRequest } from "../interfaces/ReportsInterfaces.js";
import { CronUtil } from "../utils/CronUtil.js";
import { OrganizationClient } from "../entities/OrganizationClient.js";
import { em } from "../db/config/DB.js";
import { roleMiddleware } from "../middlewares/RolesMiddleware.js";
import { OrganizationRole } from "../enums/enums.js";
import type { User } from "../entities/User.js";
import { ReportsUtil } from "../utils/ReportsUtil.js";
import { FacebookDataUtil } from "../utils/FacebookDataUtil.js";
import type { Job } from "bullmq";
import { queue } from "../classes/BullMQWrapper.js";

export class ReportsController extends Router {
  constructor() {
    super({ prefix: "/api/reports" });
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

    ctx.body = await FacebookDataUtil.getAllReportData(
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

    const schedule = new SchedulingOption();

    const cronExpression =
      CronUtil.convertScheduleRequestToCron(scheduleOption);

    schedule.cronExpression =
      CronUtil.convertScheduleRequestToCron(scheduleOption);
    schedule.client = em.getReference(
      OrganizationClient,
      scheduleOption.clientUuid,
    );

    const client = await em.findOne(OrganizationClient, {
      uuid: scheduleOption.clientUuid,
    });

    const job: Job = await queue.addScheduledJob(
      `report-schedule:org:${user.activeOrganization}:client:${scheduleOption.clientUuid}:${scheduleOption.frequency}`,
      {
        ...scheduleOption,
        organizationUuid: user.activeOrganization?.uuid,
        accountId: client?.name,
        reviewNeeded: scheduleOption.reviewNeeded,
      },
      cronExpression,
    );

    //todo: add timezones
    schedule.reportType = scheduleOption.frequency;
    schedule.jobData = scheduleOption as any;
    schedule.timezone = "UTC";
    schedule.datePreset = scheduleOption.datePreset;
    schedule.bullJobId = job.id as string;
    schedule.nextRun = ReportsUtil.getNextRunDate(scheduleOption).toJSDate();

    await em.persistAndFlush(schedule);

    ctx.body = {
      message: "Report schedule created successfully",
      cronExpression,
    };
    ctx.status = 201;
  }
}
