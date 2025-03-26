import Router from "koa-router";
import type { Context } from "koa";
import { ReportsUtil } from "../utils/ReportsUtil.js";

export class ReportsController extends Router {
  constructor() {
    super({ prefix: "/api/reports" });
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.get("/", this.getReport);
    this.post("/schedule", this.scheduleReports);
  }

  private async getReport(ctx: Context) {
    const datePreset = ctx.query.datePreset as string;
    const organizationName = ctx.query.organizationName as string;

    ctx.body = await ReportsUtil.getAllReportData(organizationName, datePreset);
    ctx.status = 200;
  }

  private async scheduleReports(ctx: Context) {
    const datePreset = ctx.query.datePreset as string;
    const organizationName = ctx.query.organizationName as string;

    ctx.body = await ReportsUtil.getAllReportData(organizationName, datePreset);
    ctx.status = 200;
  }
}
