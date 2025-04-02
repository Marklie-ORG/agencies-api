import * as Sentry from "@sentry/node";

class SentrySingleton {
  private static instance: SentrySingleton;

  private readonly dsn: string;
  private readonly environment: string;
  private readonly tracesSampleRate: number;

  private constructor() {
    this.dsn =
      "https://65c305b8db1a44f3b3d7c243fa9c0498@o4509083503558656.ingest.de.sentry.io/4509083507884112";
    this.environment = "development";
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
