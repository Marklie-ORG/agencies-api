import Router from "@koa/router";
import type { Context } from "koa";
import type {
  CancelSubscriptionRequest,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  User,
} from "marklie-ts-core";
import { SubscriptionService } from "lib/services/SubscriptionService.js";

export class SubscriptionController extends Router {
  private service = new SubscriptionService();

  constructor() {
    super({ prefix: "/api/subscriptions" });
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.get("/plans", this.getPlans.bind(this));
    this.get("/current", this.getCurrent.bind(this));
    this.get("/usage", this.getUsage.bind(this));

    this.post("/subscribe", this.subscribe.bind(this));
    this.post("/setup-intent", this.createSetupIntent.bind(this));
    this.post("/finalize", this.finalizeCheckout.bind(this));

    this.put("/update", this.update.bind(this));

    this.post("/cancel", this.cancel.bind(this));
    this.post("/resume", this.resume.bind(this));
    this.get("/payment-methods", this.getPaymentMethods.bind(this));
  }

  private async getPlans(ctx: Context) {
    ctx.body = await this.service.getPlans();
  }

  private async getCurrent(ctx: Context) {
    const user = ctx.state.user as User;

    ctx.body = await this.service.getCurrent(user);
  }

  private async getUsage(ctx: Context) {
    const user = ctx.state.user as User;
    ctx.body = await this.service.getUsage(user);
  }

  private async subscribe(ctx: Context) {
    const user = ctx.state.user as User;
    const body = ctx.request.body as CreateSubscriptionRequest;

    ctx.body = await this.service.subscribe(user, body);
    ctx.status = 200;
  }

  private async update(ctx: Context) {
    const user = ctx.state.user as User;
    const body = ctx.request.body as UpdateSubscriptionRequest;

    ctx.body = await this.service.update(user, body);
    ctx.status = 200;
  }

  private async cancel(ctx: Context) {
    const user = ctx.state.user as User;
    const body = ctx.request.body as CancelSubscriptionRequest;

    ctx.body = await this.service.cancel(user, body);
    ctx.status = 200;
  }

  private async resume(ctx: Context) {
    const user = ctx.state.user as User;

    ctx.body = await this.service.resume(user);
    ctx.status = 200;
  }

  private async getPaymentMethods(ctx: Context) {
    const user = ctx.state.user as User;

    ctx.body = await this.service.getPaymentMethods(user);
  }

  private async createSetupIntent(ctx: Context) {
    const user = ctx.state.user as User;
    ctx.body = await this.service.createSetupIntent(user);
  }

  private async finalizeCheckout(ctx: Context) {
    ctx.body = await this.service.finalizeCheckout(
      ctx.params.session_id as string,
    );
    ctx.status = 200;
  }
}
