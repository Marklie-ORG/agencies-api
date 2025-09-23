import {
  type CancelSubscriptionRequest,
  type CreateSubscriptionRequest,
  Database,
  FreeTrialUsage,
  Organization,
  OrganizationClient,
  OrganizationMember,
  PaymentMethod,
  StripeService,
  SubscriptionPlan,
  type UpdateSubscriptionRequest,
  type User,
} from "marklie-ts-core";

export class SubscriptionService {
  private db!: Database;
  private stripe: StripeService;

  constructor(stripe = new StripeService()) {
    this.stripe = stripe;
  }

  private async init() {
    if (!this.db) {
      this.db = await Database.getInstance();
      await this.stripe.initialize();
    }
  }

  private async getUserOrg(user: User) {
    await this.init();
    if (!user?.activeOrganization?.uuid)
      throw new Error("No active organization");
    const org = await this.db.em.findOne(Organization, {
      uuid: user.activeOrganization.uuid,
    });
    if (!org) throw new Error("Organization not found");
    return org;
  }

  async getPlans() {
    await this.init();
    const plans = await this.db.em.find(
      SubscriptionPlan,
      { isActive: true },
      { orderBy: { price: "ASC" } },
    );

    return plans.map((p) => ({
      id: p.uuid,
      name: p.name,
      description: p.description,
      tier: p.tier,
      price: p.price,
      interval: p.interval,
      limits: {
        clients: { min: p.minClients, max: p.maxClients },
        teamMembers: { min: p.minTeamMembers, max: p.maxTeamMembers },
      },
      dataRefreshHours: p.dataRefreshHours ?? null,
      features: {
        customization: p.hasCustomization,
        metaIntegration: p.hasMetaIntegration,
        tiktokIntegration: p.hasTiktokIntegration,
        publishedLinks: p.hasPublishedLinks,
        loomIntegration: p.hasLoomIntegration,
        aiDescription: p.hasAIDescription,
        marklyBadge: p.hasMarklyBadge,
      },
    }));
  }

  async getCurrent(user: User) {
    const org = await this.getUserOrg(user);
    return this.stripe.getActiveSubscription(org).then(async (sub) => {
      if (!sub) {
        const trial = await this.db.em.findOne(FreeTrialUsage, {
          organization: org,
        });
        return {
          hasActiveSubscription: false,
          freeTrialUsage: trial
            ? {
                reportsUsed: trial.totalReportsSent ?? 0,
                reportsLimit: trial.maxTotalReports ?? 0,
                startedAt: trial.createdAt ?? null,
              }
            : null,
        };
      }
      const plan = sub.plan;
      return {
        hasActiveSubscription: true,
        subscription: {
          id: sub.plan.uuid,
          status: sub.status,
          plan: {
            id: plan.uuid,
            name: plan.name,
            tier: plan.tier,
            price: plan.price,
            interval: plan.interval,
          },
          currentPeriodStart: sub.currentPeriodStart ?? null,
          currentPeriodEnd: sub.currentPeriodEnd ?? null,
          cancelAtPeriodEnd: !!sub.cancelAtPeriodEnd,
          trialEnd: sub.trialEnd ?? null,
          usage: {
            reportsGenerated: (sub as any).reportsGeneratedThisPeriod ?? 0,
            reportsLimit: (plan as any).maxReportsPerMonth ?? 0,
          },
        },
      };
    });
  }

  async getUsage(user: User) {
    const org = await this.getUserOrg(user);

    const active = await this.stripe.getActiveSubscription(org);
    if (!active) {
      const trial = await this.db.em.findOne(FreeTrialUsage, {
        organization: org,
      });
      return {
        isFreeTrial: true,
        usage: {
          reports: {
            used: trial?.totalReportsSent ?? 0,
            limit: trial?.maxTotalReports ?? 0,
          },
        },
      };
    }
    const plan = active.plan;
    const clients = await this.db.em.count(OrganizationClient, {
      organization: org,
    });
    const members = await this.db.em.count(OrganizationMember, {
      organization: org,
    });
    // const sched = await this.db.em.count(SchedulingOption, {
    //   organization: org,
    //   isActive: true,
    // });
    const pct = (u: number, l: number) => (l ? Math.round((u / l) * 100) : 0);
    const reportsUsed = (active as any).reportsGeneratedThisPeriod ?? 0;
    const reportsLimit = (plan as any).maxReportsPerMonth ?? 0;
    return {
      isFreeTrial: false,
      usage: {
        reports: {
          used: reportsUsed,
          limit: reportsLimit,
          percentUsed: pct(reportsUsed, reportsLimit),
        },
        clients: {
          used: clients,
          limit: plan.maxClients,
          percentUsed: pct(clients, plan.maxClients),
        },
        members: {
          used: members,
          limit: plan.maxTeamMembers,
          percentUsed: pct(members, plan.maxTeamMembers),
        },
        // scheduledReports: {
        //   used: sched,
        //   limit: (plan as any).maxScheduledReports ?? 0,
        //   percentUsed: pct(sched, (plan as any).maxScheduledReports ?? 0),
        // },
      },
    };
  }

  async subscribe(user: User, body: CreateSubscriptionRequest) {
    const org = await this.getUserOrg(user);
    console.log("subbing");
    const sub = await this.stripe.createSubscription(
      org,
      body.planId,
      body.paymentMethodId,
      user,
    );

    return {
      subscription: {
        id: sub.uuid,
        status: sub.status,
        trialEnd: sub.trialEnd ?? null,
      },
    };
  }

  async update(
    user: User,
    { planId, prorationBehavior }: UpdateSubscriptionRequest,
  ) {
    const org = await this.getUserOrg(user);
    await this.init();

    const active = await this.stripe.getActiveSubscription(org);
    if (!active) throw new Error("No active subscription");

    const oldPlan = active.plan;
    const newPlan = await this.db.em.findOne(SubscriptionPlan, {
      uuid: planId,
    });
    if (!newPlan) throw new Error("Invalid plan ID");

    // Determine upgrade vs downgrade (prefer limits; fallback to price)
    const isUpgrade =
      newPlan.maxClients > oldPlan.maxClients ||
      newPlan.maxTeamMembers > oldPlan.maxTeamMembers ||
      newPlan.price > oldPlan.price;

    if (isUpgrade) {
      // upgrade now with prorations (or honor explicit behavior if provided)
      const sub = await this.stripe.updateSubscription(
        org,
        planId,
        prorationBehavior ?? "create_prorations",
        user,
      );
      return {
        subscription: { id: sub.uuid, status: sub.status, change: "upgraded" },
      };
    }

    // Downgrade path — check current usage
    const clients = await this.db.em.count(OrganizationClient, {
      organization: org,
    });
    const members = await this.db.em.count(OrganizationMember, {
      organization: org,
    });

    const wouldBreakLimits =
      clients > newPlan.maxClients || members > newPlan.maxTeamMembers;

    if (wouldBreakLimits) {
      // schedule downgrade at period end so customer can tidy up usage
      const scheduled = await this.stripe.scheduleDowngradeAtPeriodEnd(
        org,
        planId,
        user,
      );
      return {
        subscription: {
          id: active.uuid,
          status: active.status,
          change: "downgrade_scheduled",
          scheduledAt: scheduled.scheduledAt,
        },
        note: "Downgrade scheduled at period end because current usage exceeds the new plan limits.",
      };
    }

    // Safe to apply downgrade right now, no proration credits
    const sub = await this.stripe.updateSubscription(
      org,
      planId,
      prorationBehavior ?? "none",
      user,
    );
    return {
      subscription: { id: sub.uuid, status: sub.status, change: "downgraded" },
    };
  }

  async cancel(user: User, { immediately }: CancelSubscriptionRequest) {
    const org = await this.getUserOrg(user);
    const sub = await this.stripe.cancelSubscription(org, !immediately);
    return {
      subscription: {
        id: sub.uuid,
        status: sub.status,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
        canceledAt: sub.canceledAt ?? null,
      },
    };
  }

  async getPaymentMethods(user: User) {
    const org = await this.getUserOrg(user);
    await this.init();
    const pms = await this.db.em.find(PaymentMethod, { organization: org });
    return {
      paymentMethods: pms.map((pm) => ({
        id: pm.uuid,
        type: pm.type,
        last4: pm.last4,
        brand: pm.brand,
        expiryMonth: pm.expiryMonth,
        expiryYear: pm.expiryYear,
        isDefault: pm.isDefault,
      })),
    };
  }

  async createSetupIntent(user: User) {
    const org = await this.getUserOrg(user);

    const { clientSecret, customerId } =
      await this.stripe.createSetupIntent(org);

    return { clientSecret, customerId };
  }

  async createSession(user: User, priceId: string) {
    const org = await this.getUserOrg(user);

    const { clientSecret } = await this.stripe.createSession(org, priceId);

    return { clientSecret };
  }

  async finalizeCheckout(sessionId: string) {
    return await this.stripe.finalizeCheckout(sessionId);
  }
}
