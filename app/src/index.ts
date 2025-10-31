import Koa from "koa";
import "dotenv/config";
import { Log, Validator } from "marklie-ts-core";
import { AgencyServiceConfig } from "./lib/config/config.js";
import { routes } from "./routes.js";
import { agenciesValidationRules } from "./lib/schemas/ValidationRules.js";
import { applyMiddlewares } from "./middlewares.js";

const app = new Koa();

app.proxy = true;

const logger: Log = Log.getInstance().extend("service");
const config = AgencyServiceConfig.getInstance();

Validator.registerRules(agenciesValidationRules);
logger.info("Validation rules registered!");

applyMiddlewares(app, config);
app.use(routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Auth server is running at ${PORT}`);
});
