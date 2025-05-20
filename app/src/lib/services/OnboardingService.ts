import { Database, OnboardingQuestionAnswer, OrganizationToken, User } from "marklie-ts-core";
import type { OnboardingSteps } from "marklie-ts-core/dist/lib/interfaces/OnboardingInterfaces.js";

const database = await Database.getInstance();

export class OnboardingService {

  async createOnboardingQuestionAnswer(question: string, answer: string, user: User) {
    
    const newAnswer = database.em.create(OnboardingQuestionAnswer, {
        question: question,
        answer: answer,
        user: user
    });

    await database.em.persistAndFlush(newAnswer);
  }

  async getOnboardingSteps(user: User) {
    let organizationToken;
    
    const questions = await database.em.find(OnboardingQuestionAnswer, { user });
    
    organizationToken = await database.em.findOne(OrganizationToken, { organization: user.activeOrganization });

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

    return onboardingSteps;
  }

}
