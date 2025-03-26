import { Entity, Property, BeforeCreate, OneToOne } from "@mikro-orm/core";
import bcrypt from "bcryptjs";
import { BaseEntity } from "./BaseEntity.js";
import type { Organization } from "./Organization.js";

@Entity()
export class OrganizationTokens extends BaseEntity {
  @Property()
  facebookAccessToken!: string;

  @OneToOne({ mappedBy: "tokens" })
  organization!: Organization;

  @BeforeCreate()
  async hashPassword() {
    this.facebookAccessToken = await bcrypt.hash(this.facebookAccessToken, 10);
  }
}
