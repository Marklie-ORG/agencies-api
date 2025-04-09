import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { Organization } from "./Organization.js";
import { SchedulingOption } from "./SchedulingOption.js";
import { Platform } from "../enums/enums.js";
@Entity()
export class OrganizationClient extends BaseEntity {
  @Property()
  name!: string;

  @Property({ type: 'array' })
  connectedPlatforms: Platform[] = [];

  @ManyToOne(() => Organization)
  organization!: Organization;

  @OneToMany(
    () => SchedulingOption,
    (schedulingOption: SchedulingOption) => schedulingOption.client,
  )
  schedulingOption? = new Collection<SchedulingOption>(this);
}
