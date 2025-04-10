import Koa from "koa";
import koabodyparser from "koa-bodyparser";
import cors from "@koa/cors";
import { ReportsController } from "./lib/controllers/ReportsController.js";
import { AuthController } from "./lib/controllers/AuthenticationController.js";
import { AdAccountsController } from "lib/controllers/AdAccountsController.js";
import { UserController } from "./lib/controllers/UserController.js";
import {
  AuthMiddleware,
  CookiesMiddleware,
  Database,
  ErrorMiddleware,
  Log,
  ValidationMiddleware,
} from "markly-ts-core";

const app = new Koa();

const logger: Log = Log.getInstance().extend("service");
const database = await Database.getInstance();

await database.orm.connect().then(() => {
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
