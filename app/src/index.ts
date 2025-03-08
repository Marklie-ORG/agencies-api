import Koa from "koa";
import koabodyparser from "koa-bodyparser";
import {ValidationMiddleware} from "./lib/middlewares/ValidationMiddleware.js";
import {HelloController} from "./lib/controllers/HelloController.js";
import {ErrorMiddleware} from "./lib/middlewares/ErrorMiddleware.js";
import {orm} from "./lib/db/config/DB.js";

const app = new Koa();

await orm.connect().then(() => {
  console.log("Database has connected!");
});

app.use(koabodyparser());
app.use(ErrorMiddleware());
app.use(ValidationMiddleware());
app.use(koabodyparser());
app
    .use(new HelloController().routes())
    .use(new HelloController().allowedMethods());

app.listen(3000, () => {
  console.log(`Auth server is running at ${3000}`);
});
// const recommendations = await FacebookReportsApi.getBatchedData("last_7d")
// console.log(recommendations)