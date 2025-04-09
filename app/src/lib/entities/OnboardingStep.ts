import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";

@Entity()
export class OnboardingStep extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @Property()
  displayOrder!: number;
} 