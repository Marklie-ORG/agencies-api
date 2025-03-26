import {
  Entity,
  Property,
  OneToMany,
  Collection,
  OneToOne,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { OrganizationMember } from "./OrganizationMember.js";
import { OrganizationClient } from "./OrganizationClient.js";
import { OrganizationTokens } from "./OrganizationTokens.js";

@Entity()
export class Organization extends BaseEntity {
  @Property()
  name!: string;

  @OneToOne(() => OrganizationTokens, { nullable: true })
  tokens?: OrganizationTokens;

  @OneToMany(() => OrganizationMember, (orgMember) => orgMember.organization)
  members = new Collection<OrganizationMember>(this);

  @OneToMany(() => OrganizationClient, (client) => client.organization)
  clients = new Collection<OrganizationClient>(this);
}
