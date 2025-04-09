import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";
import { OnboardingStep } from "./OnboardingStep.js";

@Entity()
export class UserOnboardingProgress extends BaseEntity {
  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => OnboardingStep)
  step!: OnboardingStep;

  @Property()
  completedAt: Date = new Date();
} 