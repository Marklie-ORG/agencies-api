import Router from "koa-router";
import type { Context } from "koa";
import { PubSubWrapper } from "../utils/PubSub.js";
import { OrganizationRole } from "marklie-ts-core/dist/lib/enums/enums.js";
import { RoleMiddleware } from "marklie-ts-core";
import type { ReportScheduleRequest } from "marklie-ts-core/dist/lib/interfaces/ReportsInterfaces.js";

export class ReportsController extends Router {
  constructor() {
    super({ prefix: "/api/reports" });
    this.setUpRoutes();
  }

  private setUpRoutes() {
    // this.get("/", this.getReport);
    this.post(
      "/schedule",
      RoleMiddleware(OrganizationRole.OWNER),
      this.scheduleReports.bind(this),
    );
  }

  // private async getReport(ctx: Context) {
  //   const organizationUuid = ctx.query.organizationUuid as string;
  //   const accountId = ctx.query.accountId as string;
  //   const datePreset = ctx.query.datePreset as string;
  //
  //   ctx.body = this.reportsService.getReport(
  //     organizationUuid,
  //     accountId,
  //     datePreset,
  //   );
  //   ctx.status = 200;
  // }

  private async scheduleReports(ctx: Context) {
    const scheduleOption: ReportScheduleRequest = ctx.request
      .body as ReportScheduleRequest;

    await PubSubWrapper.publishMessage("report", scheduleOption);

    ctx.body = {
      message: "Report schedule created successfully",
    };
    ctx.status = 201;
  }
}
