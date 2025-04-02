import * as Sentry from "@sentry/node";

class SentrySingleton {
  private static instance: SentrySingleton;

  private readonly dsn: string;
  private readonly environment: string;
  private readonly tracesSampleRate: number;

  private constructor() {
    this.dsn = process.env.SENTRY_DSN as string;
    this.environment = process.env.ENVIRONMENT as string;
    this.tracesSampleRate = 1.0;
    this.init();
  }

  public init(): void {
    Sentry.init({
      dsn: this.dsn,
      environment: this.environment,
      tracesSampleRate: this.tracesSampleRate,
    });
  }

  public static getInstance(): SentrySingleton {
    if (!SentrySingleton.instance) {
      SentrySingleton.instance = new SentrySingleton();
    }
    return SentrySingleton.instance;
  }

  public captureException(error: Error): void {
    Sentry.captureException(error);
  }
}

export const sentry = SentrySingleton.getInstance();
