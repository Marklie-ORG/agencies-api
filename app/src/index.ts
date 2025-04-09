import "./lib/classes/Sentry.js";
import Koa from "koa";
import koabodyparser from "koa-bodyparser";
import cors from "@koa/cors";
import { ValidationMiddleware } from "./lib/middlewares/ValidationMiddleware.js";
import { ReportsController } from "./lib/controllers/ReportsController.js";
import { ErrorMiddleware } from "./lib/middlewares/ErrorMiddleware.js";
import { orm } from "./lib/db/config/DB.js";
import { AuthController } from "./lib/controllers/AuthenticationController.js";
import { AuthMiddleware } from "./lib/middlewares/AuthMiddleware.js";
import { AdAccountsController } from "lib/controllers/AdAccountsController.js";
import { CookiesMiddleware } from "./lib/middlewares/CookiesMiddleware.js";
import { UserController } from "./lib/controllers/UserController.js";
import * as Sentry from "@sentry/node";
import { Log } from "./lib/classes/Logger.js";

const app = new Koa();
Sentry.setupKoaErrorHandler(app);

const logger: Log = Log.getInstance().extend("service");

await orm.connect().then(() => {
  logger.info("Database has connected!");
});

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  }),
);
app.use(koabodyparser());
app.use(CookiesMiddleware);
app.use(AuthMiddleware());
app.use(ValidationMiddleware());
app.use(ErrorMiddleware());
app
  .use(new ReportsController().routes())
  .use(new ReportsController().allowedMethods());

app
  .use(new UserController().routes())
  .use(new UserController().allowedMethods());

app
  .use(new AuthController().routes())
  .use(new AuthController().allowedMethods());

app
  .use(new AdAccountsController().routes())
  .use(new AdAccountsController().allowedMethods());

app.listen(3000, () => {
  logger.info(`Auth server is running at ${3000}`);
});
