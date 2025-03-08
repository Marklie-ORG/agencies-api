import { Entity, Property, BeforeCreate } from "@mikro-orm/core";
import bcrypt from "bcrypt";
import { BaseEntity } from "./BaseEntity.js";

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

  @BeforeCreate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
