import { Queue, Worker, Job, JobScheduler } from "bullmq";
import type Redis from "ioredis";
import redis from "../db/redis/Redis.js";
import { Log } from "../utils/Logger.js";
import type { ReportJobData } from "../interfaces/ReportsInterfaces.js";
import { ReportsUtil } from "../utils/ReportsUtil.js";

const logger: Log = Log.getInstance().extend("service");

export class BullMQWrapper {
  private queue: Queue;
  private worker: Worker;
  private scheduler: JobScheduler;

  constructor(queueName: string, connection: Redis) {
    this.queue = new Queue(queueName, { connection });
    this.scheduler = new JobScheduler(queueName, { connection });
    this.worker = new Worker(
      queueName,
      async (job: Job) => {
        return this.processJob(job);
      },
      { connection },
    );

    this.worker.on("failed", (job, err) => {
      logger.error(`Job ${(job as Job).id} failed: ${err.message}`);
    });
  }

  private async processJob(job: Job): Promise<any> {
    logger.info(
      `Processing job ${job.id} with data: ` + JSON.stringify(job.data),
    );
    const data: ReportJobData = await job.data();

    await ReportsUtil.processScheduledReportJob(data);
  }

  public async addScheduledJob(
    jobName: string,
    data: any,
    cron: string,
  ): Promise<Job> {
    return await this.queue.add(jobName, data, { repeat: { pattern: cron } });
  }

  public async addJob(jobName: string, data: any): Promise<Job> {
    return await this.queue.add(jobName, data);
  }

  public async getJob(jobId: string): Promise<Job | null> {
    return await this.queue.getJob(jobId);
  }

  public async removeJob(jobId: string): Promise<void> {
    const job = await this.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }

  public async close(): Promise<void> {
    await this.worker.close();
    await this.queue.close();
    await this.scheduler.close();
  }
}

export const queue = new BullMQWrapper(
  "ReportsQueue",
  redis.getInstance().duplicate(),
);
