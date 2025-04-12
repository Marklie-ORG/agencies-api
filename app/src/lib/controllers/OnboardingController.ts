import Router from "koa-router";
import type { Context } from "koa";
import type { SaveAnswerRequest } from "markly-ts-core/dist/lib/interfaces/OnboardingInterfaces.js";
import { Database, OnboardingQuestionAnswer } from "markly-ts-core";

const database = await Database.getInstance();

export class OnboardingController extends Router {
  constructor() {
    super({ prefix: "/api/onboarding" });
    this.setUpRoutes();
  } 

  private setUpRoutes() {
    this.post("/answer", (ctx) => this.saveAnswer(ctx));
  }

  private async saveAnswer(ctx: Context) {
    const body = ctx.request.body as SaveAnswerRequest;
    const user = ctx.state.user;
  
    const newAnswer = database.em.create(OnboardingQuestionAnswer, {
      question: body.question,
      answer: body.answer,
      user: user
    });

    await database.em.persistAndFlush(newAnswer);

    ctx.body = { message: "Answer saved successfully." };
    ctx.status = 200;
  }
}
