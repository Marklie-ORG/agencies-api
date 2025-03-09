import Router from "koa-router";
import type { Context } from "koa";
import { ReportsUtil } from "../utils/ReportsUtil.js";

export class ReportsController extends Router {
  constructor() {
    super({ prefix: "/api/reports" });
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.get("/get-report", this.getReport);
  }

  private async getReport(ctx: Context) {
    const datePreset = ctx.query.datePreset as string;

    ctx.body = await ReportsUtil.getAllReportData(datePreset);
    ctx.status = 200;
  }
}
