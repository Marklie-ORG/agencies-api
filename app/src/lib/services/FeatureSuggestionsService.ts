import {
  Database,
  FeatureComment,
  FeatureSuggestion,
  FeatureUpvote,
  type User,
} from "marklie-ts-core";

const database = await Database.getInstance();

export class FeatureSuggestionsService {
  public async createSuggestion(
    title: string,
    description: string,
    user: User,
  ) {
    const suggestion = database.em.create(FeatureSuggestion, {
      title,
      description,
      user,
      organization: user.activeOrganization!,
    });
    await database.em.persistAndFlush(suggestion);
    return { uuid: suggestion.uuid, message: "Suggestion created" };
  }

  public async getSuggestionsWithAggregates(user: User) {
    const suggestions = await this.listSuggestions();
    const aggregates = await this.getAggregatesFor(user, suggestions);

    return suggestions.map((s) => ({
      uuid: s.uuid,
      title: s.title,
      description: s.description,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      organizationUuid: s.organization.uuid,
      user: {
        uuid: s.user.uuid,
        firstName: s.user.firstName,
        lastName: s.user.lastName,
        email: s.user.email,
      },
      upvotes: aggregates.upvoteCounts.get(s.uuid) || 0,
      userHasUpvoted: aggregates.userUpvoted.has(s.uuid),
      commentsCount: aggregates.commentCounts.get(s.uuid) || 0,
    }));
  }

  public async getSingleSuggestionWithAggregates(uuid: string, user: User) {
    const suggestion = await this.findSuggestion(uuid);
    const aggregates = await this.getAggregatesFor(user, [suggestion]);

    return {
      uuid: suggestion.uuid,
      title: suggestion.title,
      description: suggestion.description,
      createdAt: suggestion.createdAt,
      updatedAt: suggestion.updatedAt,
      organizationUuid: suggestion.organization.uuid,
      user: {
        uuid: suggestion.user.uuid,
        firstName: suggestion.user.firstName,
        lastName: suggestion.user.lastName,
        email: suggestion.user.email,
      },
      upvotes: aggregates.upvoteCounts.get(suggestion.uuid) || 0,
      userHasUpvoted: aggregates.userUpvoted.has(suggestion.uuid),
      commentsCount: aggregates.commentCounts.get(suggestion.uuid) || 0,
    };
  }

  public async getFormattedComments(suggestionUuid: string) {
    const comments = await database.em.find(
      FeatureComment,
      { suggestion: { uuid: suggestionUuid } },
      {
        orderBy: { createdAt: "ASC" },
        populate: ["user", "suggestion"],
      },
    );

    return comments.map((c) => ({
      uuid: c.uuid,
      comment: c.comment,
      createdAt: c.createdAt,
      user: {
        uuid: c.user.uuid,
        firstName: c.user.firstName,
        lastName: c.user.lastName,
        email: c.user.email,
      },
    }));
  }

  public async toggleUpvote(suggestionUuid: string, user: User) {
    const suggestion = await database.em.findOneOrFail(FeatureSuggestion, {
      uuid: suggestionUuid,
    });

    const existing = await database.em.findOne(FeatureUpvote, {
      suggestion,
      user,
    });

    if (existing) {
      await database.em.removeAndFlush(existing);
      return { upvoted: false };
    }

    const upvote = database.em.create(FeatureUpvote, {
      suggestion,
      user,
      value: true,
    });

    await database.em.persistAndFlush(upvote);
    return { upvoted: true };
  }

  private async listSuggestions(): Promise<FeatureSuggestion[]> {
    return await database.em.findAll(FeatureSuggestion, {
      orderBy: { createdAt: "DESC" },
      populate: ["user", "organization"],
    });
  }

  private async findSuggestion(uuid: string): Promise<FeatureSuggestion> {
    return await database.em.findOneOrFail(
      FeatureSuggestion,
      { uuid },
      { populate: ["user", "organization"] },
    );
  }

  private async getAggregatesFor(user: User, suggestions: FeatureSuggestion[]) {
    const suggestionUuids = suggestions.map((s) => s.uuid);

    const [upvotes, comments] = await Promise.all([
      database.em.find(FeatureUpvote, {
        suggestion: { uuid: { $in: suggestionUuids } },
      }),
      database.em.find(FeatureComment, {
        suggestion: { uuid: { $in: suggestionUuids } },
      }),
    ]);

    const upvoteCounts = new Map<string, number>();
    const userUpvoted = new Set<string>();
    const commentCounts = new Map<string, number>();

    for (const u of upvotes) {
      const id = u.suggestion.uuid;
      upvoteCounts.set(id, (upvoteCounts.get(id) || 0) + 1);
      if (u.user.uuid === user.uuid) {
        userUpvoted.add(id);
      }
    }

    for (const c of comments) {
      const id = c.suggestion.uuid;
      commentCounts.set(id, (commentCounts.get(id) || 0) + 1);
    }

    return { upvoteCounts, userUpvoted, commentCounts };
  }

  public async addComment(suggestionUuid: string, comment: string, user: User) {
    const suggestion = await database.em.findOneOrFail(FeatureSuggestion, {
      uuid: suggestionUuid,
    });

    const newComment = database.em.create(FeatureComment, {
      suggestion,
      comment,
      user,
    });

    await database.em.persistAndFlush(newComment);

    return {
      uuid: newComment.uuid,
      message: "Comment added",
    };
  }
}
