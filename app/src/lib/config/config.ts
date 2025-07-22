import { authEnvSchema, ConfigService } from "marklie-ts-core";
import { z } from "zod";

export type AgencyServiceEnvironment = z.infer<typeof authEnvSchema>;

export class AgencyServiceConfig extends ConfigService<AgencyServiceEnvironment> {
  private static instance: AgencyServiceConfig;

  private constructor() {
    super(authEnvSchema, "reports-service");
  }

  public static getInstance(): AgencyServiceConfig {
    if (!AgencyServiceConfig.instance) {
      AgencyServiceConfig.instance = new AgencyServiceConfig();
    }
    return AgencyServiceConfig.instance;
  }
}
