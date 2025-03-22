import { Entity, Property, BeforeCreate, OneToOne } from "@mikro-orm/core";
import bcrypt from "bcryptjs";
import { BaseEntity } from "./BaseEntity.js";
import { OrganizationClient } from "./OrganizationClient.js";

@Entity()
export class ClientTokens extends BaseEntity {
  @Property()
  facebookAccessToken!: string;

  @OneToOne(() => OrganizationClient, { mappedBy: "tokens" })
  client!: OrganizationClient;

  @BeforeCreate()
  async hashPassword() {
    this.facebookAccessToken = await bcrypt.hash(this.facebookAccessToken, 10);
  }
}
