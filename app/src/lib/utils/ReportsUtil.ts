import type { ReportScheduleRequest } from "../interfaces/ReportsInterfaces.js";
import { DateTime, type WeekdayNumbers } from "luxon";

export class ReportsUtil {
  private static getWeekday(day: string): WeekdayNumbers {
    switch (day) {
      case "Monday":
        return 1;
      case "Tuesday":
        return 2;
      case "Wednesday":
        return 3;
      case "Thursday":
        return 4;
      case "Friday":
        return 5;
      case "Saturday":
        return 6;
      case "Sunday":
        return 7;
      default:
        return 1;
    }
  }

  public static getNextRunDate(scheduleOption: ReportScheduleRequest) {
    const now = DateTime.now().setZone("UTC");
    let nextRun: DateTime;
    switch (scheduleOption.frequency) {
      case "weekly": {
        const targetWeekday: WeekdayNumbers = this.getWeekday(
          scheduleOption.dayOfWeek,
        );
        nextRun = now.set({
          weekday: targetWeekday,
          hour: Number(scheduleOption.time.split(":")[0]),
          minute: Number(scheduleOption.time.split(":")[1]),
          second: 0,
          millisecond: 0,
        });
        if (nextRun < now) {
          nextRun = nextRun.plus({ weeks: 1 });
        }
        break;
      }
      case "biweekly": {
        const targetWeekday: WeekdayNumbers = this.getWeekday(
          scheduleOption.dayOfWeek,
        );
        nextRun = now.set({
          weekday: targetWeekday,
          hour: Number(scheduleOption.time.split(":")[0]),
          minute: Number(scheduleOption.time.split(":")[1]),
          second: 0,
          millisecond: 0,
        });
        if (nextRun < now) {
          nextRun = nextRun.plus({ weeks: 2 });
        }
        break;
      }
      case "monthly": {
        nextRun = now.set({
          day: scheduleOption.dayOfMonth,
          hour: Number(scheduleOption.time.split(":")[0]),
          minute: Number(scheduleOption.time.split(":")[1]),
          second: 0,
          millisecond: 0,
        });
        if (nextRun < now) {
          nextRun = nextRun.plus({ months: 1 });
        }
        break;
      }
      case "custom": {
        nextRun = now.set({
          hour: Number(scheduleOption.time.split(":")[0]),
          minute: Number(scheduleOption.time.split(":")[1]),
          second: 0,
          millisecond: 0,
        });
        if (nextRun < now) {
          nextRun = now.plus({ days: scheduleOption.intervalDays });
        } else {
          nextRun = nextRun.plus({
            days: scheduleOption.intervalDays,
          });
        }
        break;
      }
      default: {
        nextRun = now;
      }
    }
    return nextRun;
  }
}
