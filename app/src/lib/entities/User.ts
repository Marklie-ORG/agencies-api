import { Entity, Property, BeforeCreate, ManyToOne } from "@mikro-orm/core";
import bcrypt from "bcryptjs";
import { BaseEntity } from "./BaseEntity.js";
import { Organization } from "./Organization.js";

@Entity()
export class User extends BaseEntity {
  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @ManyToOne(() => Organization, { nullable: true })
  activeOrganization?: Organization;

  @BeforeCreate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
