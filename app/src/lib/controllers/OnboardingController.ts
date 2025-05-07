import Router from "koa-router";
import type { Context } from "koa";
import type { SaveAnswerRequest } from "marklie-ts-core/dist/lib/interfaces/OnboardingInterfaces.js";
import { OnboardingService } from "lib/services/OnboardingService.js";

export class OnboardingController extends Router {
  private readonly onboardingService: OnboardingService;
  constructor() {
    super({ prefix: "/api/onboarding" });
    this.onboardingService = new OnboardingService();
    this.setUpRoutes();
  } 

  private setUpRoutes() {
    this.post("/answer", this.saveAnswer.bind(this));
    this.get("/onboarding-steps", this.getOnboardingSteps.bind(this));
  }

  private async saveAnswer(ctx: Context) {
    const body = ctx.request.body as SaveAnswerRequest;
    const user = ctx.state.user;
  
    await this.onboardingService.createOnboardingQuestionAnswer(body.question, body.answer, user);

    ctx.body = { message: "Answer saved successfully." };
    ctx.status = 200;
  }

  private async getOnboardingSteps(ctx: Context) {
    const user = ctx.state.user;
    
    const onboardingSteps = await this.onboardingService.getOnboardingSteps(user);

    ctx.body = onboardingSteps;
    ctx.status = 200;
  }

}


