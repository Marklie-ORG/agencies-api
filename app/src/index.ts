import Koa from "koa";
import koabodyparser from "koa-bodyparser";
import { ValidationMiddleware } from "./lib/middlewares/ValidationMiddleware.js";
import { ReportsController } from "./lib/controllers/ReportsController.js";
import { ErrorMiddleware } from "./lib/middlewares/ErrorMiddleware.js";
import { orm } from "./lib/db/config/DB.js";
import { BullMQWrapper } from "./lib/utils/BullMQWrapper.js";
import redis from "./lib/db/redis/Redis.js";

const app = new Koa();

await orm.connect().then(() => {
  console.log("Database has connected!");
});

app.use(koabodyparser());
app.use(ErrorMiddleware());
app.use(ValidationMiddleware());
app.use(koabodyparser());
app
  .use(new ReportsController().routes())
  .use(new ReportsController().allowedMethods());

app.listen(3000, () => {
  console.log(`Auth server is running at ${3000}`);
});

await orm.getSchemaGenerator().updateSchema();

const queue = new BullMQWrapper("reportQueue", redis.getInstance().duplicate());
await queue.addScheduledJob(
  "generateReport",
  { clientId: 123, reportType: "weekly" },
  "* * * * *",
);
