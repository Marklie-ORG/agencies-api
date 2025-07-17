import Koa from "koa";
import koabodyparser from "koa-bodyparser";
import "dotenv/config";
import cors from "@koa/cors";
import { AuthController } from "./lib/controllers/AuthenticationController.js";
import { AdAccountsController } from "lib/controllers/AdAccountsController.js";
import { UserController } from "./lib/controllers/UserController.js";
import {
  AuthMiddleware,
  CookiesMiddleware,
  ErrorMiddleware,
  Log,
  ValidationMiddleware,
} from "marklie-ts-core";
import { OnboardingController } from "lib/controllers/OnboardingController.js";
import { OrganizationController } from "lib/controllers/OrganizationController.js";
import { ClientController } from "lib/controllers/ClientController.js";
import { ImagesController } from "lib/controllers/ImagesController.js";
import { AgencyServiceConfig } from "./lib/config/config.js";

const app = new Koa();

app.proxy = true;

const logger: Log = Log.getInstance().extend("service");
const config = AgencyServiceConfig.getInstance();

app.use(
  cors({
    origin: (ctx) => {
      const allowedOrigins = config.get("ALLOWED_ORIGINS");
      const requestOrigin = ctx.request.header.origin;
      if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        return requestOrigin;
      }
      return allowedOrigins[0];
    },
    credentials: true,
  }),
);

app.use(koabodyparser());
app.use(CookiesMiddleware);
app.use(AuthMiddleware());
app.use(ValidationMiddleware());
app.use(ErrorMiddleware());

app
  .use(new UserController().routes())
  .use(new UserController().allowedMethods());

app
  .use(new AuthController().routes())
  .use(new AuthController().allowedMethods());

app
  .use(new AdAccountsController().routes())
  .use(new AdAccountsController().allowedMethods());

app
  .use(new OnboardingController().routes())
  .use(new OnboardingController().allowedMethods());

app
  .use(new OrganizationController().routes())
  .use(new OrganizationController().allowedMethods());

app
  .use(new ClientController().routes())
  .use(new ClientController().allowedMethods());

app
  .use(new ImagesController().routes())
  .use(new ImagesController().allowedMethods());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Auth server is running at ${PORT}`);
});
