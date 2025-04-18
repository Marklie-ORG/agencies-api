import Router from "koa-router";
import type { Context } from "koa";
import type { SaveAnswerRequest, OnboardingSteps } from "markly-ts-core/dist/lib/interfaces/OnboardingInterfaces.js";
import { Database, OnboardingQuestionAnswer, OrganizationToken } from "markly-ts-core";

const database = await Database.getInstance();

export class OnboardingController extends Router {
  constructor() {
    super({ prefix: "/api/onboarding" });
    this.setUpRoutes();
  } 

  private setUpRoutes() {
    this.post("/answer", (ctx) => this.saveAnswer(ctx));
    this.get("/onboarding-steps", (ctx) => this.getOnboardingSteps(ctx));
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

  private async getOnboardingSteps(ctx: Context) {
    const user = ctx.state.user;

    console.log(user)
    
    let organizationToken;
    // Fetch questions and organization token in parallel for better performance
    const questions = await database.em.find(OnboardingQuestionAnswer, { user });
    console.log(questions)
    try{
      organizationToken = await database.em.findOne(OrganizationToken, { organization: user.activeOrganization });
    }
    catch(error) {
      console.error(error)
    }
    
    
    console.log(organizationToken)

    // Create a map of questions for O(1) lookups instead of repeated find operations
    const questionMap = new Map(questions.map((q: OnboardingQuestionAnswer) => [q.question, q]));
    
    const onboardingSteps: OnboardingSteps = {
      nameAnswered: Boolean(user.firstName && user.lastName),
      isOwnerAnswered: questionMap.has("isOwner"),
      organizationCreated: Boolean(user.activeOrganization),
      clientsAmountAnswered: questionMap.has("clientsAmount"),
      advertisingPlatformsAnswered: questionMap.has("advertisingPlatforms"),
      communicationPlatformsAnswered: questionMap.has("communicationPlatforms"),
      howDidYouHearAnswered: questionMap.has("howDidYouHear"),
      facebookConnected: Boolean(organizationToken),
      onboardingFinished: false
    };

    onboardingSteps.onboardingFinished = onboardingSteps.nameAnswered &&
      onboardingSteps.isOwnerAnswered &&
      onboardingSteps.organizationCreated &&
      onboardingSteps.clientsAmountAnswered &&
      onboardingSteps.advertisingPlatformsAnswered &&
      onboardingSteps.communicationPlatformsAnswered &&
      onboardingSteps.howDidYouHearAnswered &&
      onboardingSteps.facebookConnected;

    ctx.body = onboardingSteps;
    ctx.status = 200;
  }

}


