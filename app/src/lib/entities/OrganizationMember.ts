import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";
import { Organization } from "./Organization.js";
import { OrganizationRole } from "../enums/enums.js";

@Entity()
export class OrganizationMember extends BaseEntity {
  @ManyToOne(() => Organization)
  organization!: Organization;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  role: OrganizationRole = OrganizationRole.READER;
}
