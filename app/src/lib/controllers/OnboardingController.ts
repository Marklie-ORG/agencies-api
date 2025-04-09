import Router from "koa-router";
import { UserOnboardingProgress } from "../entities/UserOnboardingProgress.js";
import { OnboardingStep } from "../entities/OnboardingStep.js";
import { em } from "../db/config/DB.js";
import type { Context } from "koa";

export class OnboardingController {
  private router: Router;

  constructor() {
    this.router = new Router({
      prefix: "/api/onboarding"
    });

    this.router.get("/completed", this.getCompletedSteps.bind(this));
    this.router.get("/remaining", this.getRemainingSteps.bind(this));
    this.router.get("/status", this.checkOnboardingCompletion.bind(this));
    this.router.post("/complete/:stepId", this.completeStep.bind(this));
  }

  routes() {
    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }

  private async getCompletedSteps(ctx: Context) {
    try {
      const userId = ctx.state.user?.uuid;
      if (!userId) {
        ctx.status = 401;
        ctx.body = { error: "Unauthorized" };
        return;
      }

      const completedSteps = await em.find(UserOnboardingProgress, 
        { user: userId },
        { populate: ['step'] }
      );

      ctx.body = {
        completedSteps: completedSteps.map(progress => ({
          stepId: progress.step.uuid,
          name: progress.step.name,
          completedAt: progress.completedAt
        }))
      };
    } catch (error) {
      console.error('Error fetching completed steps:', error);
      ctx.status = 500;
      ctx.body = { error: "Internal server error" };
    }
  }

  private async getRemainingSteps(ctx: Context) {
    try {
      const userId = ctx.state.user?.uuid;
      if (!userId) {
        ctx.status = 401;
        ctx.body = { error: "Unauthorized" };
        return;
      }

      // Get all steps
      const allSteps = await em.find(OnboardingStep, {}, { orderBy: { displayOrder: 'ASC' } });
      
      // Get completed steps
      const completedSteps = await em.find(UserOnboardingProgress, 
        { user: userId },
        { populate: ['step'] }
      );

      const completedStepIds = new Set(completedSteps.map(progress => progress.step.uuid));
      
      const remainingSteps = allSteps.filter(step => !completedStepIds.has(step.uuid));

      ctx.body = {
        remainingSteps: remainingSteps.map(step => ({
          stepId: step.uuid,
          name: step.name,
          displayOrder: step.displayOrder
        }))
      };
    } catch (error) {
      console.error('Error fetching remaining steps:', error);
      ctx.status = 500;
      ctx.body = { error: "Internal server error" };
    }
  }

  private async checkOnboardingCompletion(ctx: Context) {
    try {
      const userId = ctx.state.user?.uuid;
      if (!userId) {
        ctx.status = 401;
        ctx.body = { error: "Unauthorized" };
        return;
      }

      // Get total number of steps
      const totalSteps = await em.count(OnboardingStep);
      
      // Get number of completed steps
      const completedSteps = await em.count(UserOnboardingProgress, { user: userId });

      const isComplete = totalSteps === completedSteps;

      ctx.body = {
        isComplete,
        completedSteps,
        totalSteps,
        progress: (completedSteps / totalSteps) * 100
      };
    } catch (error) {
      console.error('Error checking onboarding completion:', error);
      ctx.status = 500;
      ctx.body = { error: "Internal server error" };
    }
  }

  private async completeStep(ctx: Context) {
    try {
      const userId = ctx.state.user?.uuid;
      if (!userId) {
        ctx.status = 401;
        ctx.body = { error: "Unauthorized" };
        return;
      }

      const stepId = ctx.params.stepId;
      if (!stepId) {
        ctx.status = 400;
        ctx.body = { error: "Step ID is required" };
        return;
      }

      // Check if step exists
      const step = await em.findOne(OnboardingStep, { uuid: stepId });
      if (!step) {
        ctx.status = 404;
        ctx.body = { error: "Step not found" };
        return;
      }

      // Check if step is already completed
      const existingProgress = await em.findOne(UserOnboardingProgress, {
        user: userId,
        step: stepId
      });

      if (existingProgress) {
        ctx.status = 200;
        ctx.body = { message: "Step already completed" };
        return;
      }

      // Create new progress entry
      const progress = new UserOnboardingProgress();
      progress.user = userId;
      progress.step = step;
      progress.completedAt = new Date();

      await em.persistAndFlush(progress);

      ctx.status = 201;
      ctx.body = {
        message: "Step completed successfully",
        stepId: step.uuid,
        name: step.name,
        completedAt: progress.completedAt
      };
    } catch (error) {
      console.error('Error completing step:', error);
      ctx.status = 500;
      ctx.body = { error: "Internal server error" };
    }
  }
} 