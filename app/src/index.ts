import Koa from "koa";
import koabodyparser from "koa-bodyparser";
import { ValidationMiddleware } from "./lib/middlewares/ValidationMiddleware.js";
import { ReportsController } from "./lib/controllers/ReportsController.js";
import { ErrorMiddleware } from "./lib/middlewares/ErrorMiddleware.js";
import { orm } from "./lib/db/config/DB.js";
import { AuthController } from "./lib/controllers/AuthenticationController.js";
import { AuthMiddleware } from "./lib/middlewares/AuthMiddleware.js";

const app = new Koa();

await orm.connect().then(() => {
  console.log("Database has connected!");
});

app.use(koabodyparser());
app.use(AuthMiddleware());
app.use(ValidationMiddleware());
app.use(ErrorMiddleware());
app
  .use(new ReportsController().routes())
  .use(new ReportsController().allowedMethods());
app
  .use(new AuthController().routes())
  .use(new AuthController().allowedMethods());

app.listen(3000, () => {
  console.log(`Auth server is running at ${3000}`);
});

await orm.getSchemaGenerator().updateSchema();
