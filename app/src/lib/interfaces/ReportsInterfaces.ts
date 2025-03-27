export type ScheduleFrequency =
  | "weekly"
  | "biweekly"
  | "monthly"
  | "custom"
  | "cron";

interface BaseSchedule {
  frequency: string;
  clientUuid: string;
}

interface TimeBasedSchedule extends BaseSchedule {
  time: string;
}

interface ScheduleModifiers {
  startDate?: string;
  conditions?: string;
}

interface WeekdaySchedule extends TimeBasedSchedule {
  dayOfWeek:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
}

export interface WeeklySchedule extends WeekdaySchedule {
  frequency: "weekly";
}

export interface BiweeklySchedule extends WeekdaySchedule {
  frequency: "biweekly";
}

export interface MonthlySchedule extends TimeBasedSchedule {
  frequency: "monthly";
  dayOfMonth: number;
}

export interface CustomSchedule extends TimeBasedSchedule, ScheduleModifiers {
  frequency: "custom";
  intervalDays: number;
}

export interface CronSchedule extends ScheduleModifiers {
  frequency: "cron";
  cronExpression: string;
  clientUuid: string;
}

export type ReportScheduleRequest =
  | WeeklySchedule
  | BiweeklySchedule
  | MonthlySchedule
  | CustomSchedule
  | CronSchedule;
