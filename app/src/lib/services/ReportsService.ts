import { User } from "../entities/User.js";
import { SchedulingOption } from "../entities/SchedulingOption.js";
import { CronUtil } from "../utils/CronUtil.js";
import { em } from "../db/config/DB.js";
import { OrganizationClient } from "../entities/OrganizationClient.js";
import type { Job } from "bullmq";
import { queue } from "../classes/BullMQWrapper.js";
import { ReportsUtil } from "../utils/ReportsUtil.js";
import type { ReportScheduleRequest } from "../interfaces/ReportsInterfaces.js";
import { FacebookDataUtil } from "../utils/FacebookDataUtil.js";

export class ReportsService {
  async createReport(
    scheduleOption: ReportScheduleRequest,
    user: User,
  ): Promise<string> {
    const schedule = new SchedulingOption();

    const cronExpression =
      CronUtil.convertScheduleRequestToCron(scheduleOption);

    schedule.cronExpression =
      CronUtil.convertScheduleRequestToCron(scheduleOption);
    schedule.client = em.getReference(
      OrganizationClient,
      scheduleOption.clientUuid,
    );

    const client = await em.findOne(OrganizationClient, {
      uuid: scheduleOption.clientUuid,
    });

    const job: Job = await queue.addScheduledJob(
      `report-schedule:org:${user.activeOrganization}:client:${scheduleOption.clientUuid}:${scheduleOption.frequency}`,
      {
        ...scheduleOption,
        organizationUuid: user.activeOrganization?.uuid,
        accountId: client?.name,
        reviewNeeded: scheduleOption.reviewNeeded,
      },
      cronExpression,
    );

    //todo: add timezones
    schedule.reportType = scheduleOption.frequency;
    schedule.jobData = scheduleOption as any;
    schedule.timezone = "UTC";
    schedule.datePreset = scheduleOption.datePreset;
    schedule.bullJobId = job.id as string;
    schedule.nextRun = ReportsUtil.getNextRunDate(scheduleOption).toJSDate();

    await em.persistAndFlush(schedule);

    return cronExpression;
  }

  async getReport(
    organizationUuid: string,
    accountId: string,
    datePreset: string,
  ) {
    return await FacebookDataUtil.getAllReportData(
      organizationUuid,
      accountId,
      datePreset,
    );
  }
}
