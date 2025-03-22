import { Entity, Property, OneToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { OrganizationClient } from "./OrganizationClient.js";

@Entity()
export class SchedulingOption extends BaseEntity {
  @Property()
  cronExpression!: string;

  @Property({ default: true })
  isActive: boolean = true;

  @Property()
  reportType!: string;

  @Property({ type: "json", nullable: true })
  jobData?: Record<string, any>;

  @Property({ nullable: true })
  timezone?: string;

  @Property({ nullable: true })
  lastRun?: Date;

  @Property({ nullable: true })
  bullJobId?: string;

  @OneToOne(() => OrganizationClient, { mappedBy: "schedulingOption" })
  client!: OrganizationClient;
}
