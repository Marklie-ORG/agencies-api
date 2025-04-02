import { isAxiosError } from "axios";
import * as crypto from "crypto";
import { createLogger, format, transports, Logger } from "winston";
import { sentry } from "./Sentry.js";

export class Log {
  private static instance: Log | null = null;
  private readonly logger: Logger;
  private readonly baseName: string;

  private constructor(baseName: string) {
    this.baseName = baseName;

    const logFormat = format.printf(({ level, message }) => {
      const coloredNamespace = this.baseName
        ? level === "error"
          ? `\x1b[31m${this.baseName}\x1b[39m`
          : `\x1b[35m${this.baseName}\x1b[39m`
        : "";
      return `${coloredNamespace} ${message}`;
    });

    this.logger = createLogger({
      level: "debug",
      format: format.combine(logFormat),
      transports: [
        new transports.Console({
          format: format.combine(logFormat),
        }),
      ],
    });
  }

  public static getInstance(): Log {
    if (!Log.instance) {
      const baseName =
        "@saas:" +
        (process.env.npm_package_name || "package-name-not-specified");
      Log.instance = new Log(baseName);
    }
    return Log.instance;
  }

  public static extendInstance(name: string) {
    return this.getInstance().extend(name);
  }

  public debug(message: string): void {
    this.logger.debug(message, { namespace: this.baseName });
  }

  public info(message: string): void {
    this.logger.info(message, { namespace: this.baseName });
  }

  public warn(message: string): void {
    this.logger.warn(message, { namespace: `${this.baseName}:warning` });
  }

  public error(message: unknown, error?: unknown): void {
    sentry.captureException(error as Error);

    if (typeof message === "string") {
      this.logger.error(message, error, {
        namespace: `${this.baseName}:warning`,
      });
    } else {
      this.logger.error(JSON.stringify(message), {
        namespace: `${this.baseName}:warning`,
      });
    }

    if (error) {
      this.logger.error(JSON.stringify(error), {
        namespace: `${this.baseName}:warning`,
      });
    }
  }

  public catchError(error: unknown): void {
    if (!error) {
      return;
    }
    sentry.captureException(error as Error);

    if (isAxiosError(error)) {
      this.error(error.toJSON());
    } else if (typeof error === "string") {
      this.error(error.toUpperCase());
    } else if (error instanceof Error) {
      this.error(error.message);
    } else if (
      typeof error === "object" &&
      Object.keys(error).includes("message")
    ) {
      this.error((error as Error).message);
    }
  }

  public catchErrorAndLogUuid(error: unknown): string {
    const uuid: string = crypto.randomUUID();
    this.error(`ERROR UUID: ${uuid}`);
    this.catchError(error);
    return uuid;
  }

  public extend(extensionName: string): Log {
    const extendedName = `${this.baseName}:${extensionName}`;
    return new Log(extendedName);
  }
}
