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


const app = new Koa();

await orm.connect().then(() => {
  console.log("Database has connected!");
});

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(koabodyparser());
app.use(AuthMiddleware());
app.use(ValidationMiddleware());
app.use(ErrorMiddleware());
app
  .use(new ReportsController().routes())
  .use(new ReportsController().allowedMethods())

  .use(new AdAccountsController().routes())
  .use(new AdAccountsController().allowedMethods());
app
  .use(new AuthController().routes())
  .use(new AuthController().allowedMethods())

  .use(new AdAccountsController().routes())
  .use(new AdAccountsController().allowedMethods());

// app
  
app.listen(3000, () => {
  console.log(`Auth server is running at ${3000}`);
});

