import { Entity, Property, BeforeCreate } from "@mikro-orm/core";
import bcrypt from "bcryptjs";
import { BaseEntity } from "./BaseEntity.js";

@Entity()
export class OrganizationTokens extends BaseEntity {
  @Property()
  organizationUuid!: string;

  @Property()
  facebookAccessToken!: string;

  @BeforeCreate()
  async hashPassword() {
    this.facebookAccessToken = await bcrypt.hash(this.facebookAccessToken, 10);
  }
}
