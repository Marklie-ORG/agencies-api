import { MarklieRouter } from "marklie-ts-core";
import { UserController } from "./lib/controllers/UserController.js";
import { AuthController } from "./lib/controllers/AuthenticationController.js";
import { AdAccountsController } from "./lib/controllers/AdAccountsController.js";
import { OnboardingController } from "./lib/controllers/OnboardingController.js";
import { OrganizationController } from "./lib/controllers/OrganizationController.js";
import { ClientController } from "./lib/controllers/ClientController.js";
import { ImagesController } from "./lib/controllers/ImagesController.js";
import { FeatureSuggestionsController } from "./lib/controllers/FeatureSuggestionsController.js";
import { SubscriptionController } from "./lib/controllers/SubscriptionController.js";

const subscriptionController = new SubscriptionController();
const featureSuggestionsController = new FeatureSuggestionsController();
const imagesController = new ImagesController();
const clientController = new ClientController();
const organizationController = new OrganizationController();
const onboardingController = new OnboardingController();
const adAccountsController = new AdAccountsController();
const authController = new AuthController();
const userController = new UserController();

const controllers = [
  subscriptionController,
  featureSuggestionsController,
  clientController,
  imagesController,
  onboardingController,
  organizationController,
  adAccountsController,
  authController,
  userController,
];

export const routes = MarklieRouter.compose(controllers);
