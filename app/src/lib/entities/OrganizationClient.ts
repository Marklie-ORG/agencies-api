import { Entity, Property, ManyToOne, OneToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { Organization } from "./Organization.js";
import { SchedulingOption } from "./SchedulingOption.js";
import { ClientTokens } from "./ClientTokens.js";

@Entity()
export class OrganizationClient extends BaseEntity {
  @Property()
  name!: string;

  @ManyToOne(() => Organization)
  organization!: Organization;

  @OneToOne(
    () => SchedulingOption,
    (schedulingOption) => schedulingOption.client,
    { owner: true },
  )
  schedulingOption?: SchedulingOption;

  @OneToOne(() => ClientTokens, (clientToken) => clientToken.client, {
    owner: true,
  })
  tokens?: ClientTokens;
}
