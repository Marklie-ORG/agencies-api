import { Database } from "marklie-ts-core";

const database = await Database.getInstance();

type AnyEntity = any;
export class FeatureSuggestionsService {
	async createSuggestion(title: string, description: string, user: AnyEntity) {
		const suggestion = database.em.create("FeatureSuggestion" as any, {
			title,
			description,
			user,
			organization: user.activeOrganization!,
		});
		await database.em.persistAndFlush(suggestion as any);
		return suggestion as any;
	}

	async listSuggestions() {
		const suggestions = await database.em.find(
			"FeatureSuggestion" as any,
			{} as any,
			{ orderBy: { createdAt: "DESC" } as any, populate: ["user", "organization"] as any }
		);
		return suggestions as any[];
	}

	async findSuggestion(uuid: string) {
		const suggestion = await database.em.findOneOrFail(
			"FeatureSuggestion" as any,
			{ uuid } as any,
			{ populate: ["user", "organization"] as any }
		);
		return suggestion as any;
	}

	async addComment(suggestionUuid: string, comment: string, user: AnyEntity) {
		const suggestion = await database.em.findOneOrFail("FeatureSuggestion" as any, {
			uuid: suggestionUuid,
		} as any);
		const newComment = database.em.create("FeatureComment" as any, {
			suggestion,
			comment,
			user,
		});
		await database.em.persistAndFlush(newComment as any);
		return newComment as any;
	}

	async toggleUpvote(suggestionUuid: string, user: AnyEntity) {
		const suggestion = await database.em.findOneOrFail("FeatureSuggestion" as any, {
			uuid: suggestionUuid,
		} as any);
		const existing = await database.em.findOne("FeatureUpvote" as any, {
			suggestion,
			user,
		} as any);
		if (existing) {
			await database.em.removeAndFlush(existing as any);
			return { upvoted: false } as const;
		}
		const upvote = database.em.create("FeatureUpvote" as any, { suggestion, user, value: true } as any);
		await database.em.persistAndFlush(upvote as any);
		return { upvoted: true } as const;
	}

	async getComments(suggestionUuid: string, _user: AnyEntity) {
		const comments = await database.em.find(
			"FeatureComment" as any,
			{ suggestion: { uuid: suggestionUuid } } as any,
			{ orderBy: { createdAt: "ASC" } as any, populate: ["user", "suggestion"] as any }
		);
		return comments as any[];
	}

	async getAggregatesFor(user: AnyEntity, suggestions: any[]) {
		const suggestionUuids = suggestions.map((s) => (s as any).uuid);
		if (suggestionUuids.length === 0) return { upvoteCounts: new Map<string, number>(), userUpvoted: new Set<string>(), commentCounts: new Map<string, number>() };
		const [upvotes, comments] = await Promise.all([
			database.em.find("FeatureUpvote" as any, { suggestion: { uuid: { $in: suggestionUuids } } } as any),
			database.em.find("FeatureComment" as any, { suggestion: { uuid: { $in: suggestionUuids } } } as any),
		]);
		const upvoteCounts = new Map<string, number>();
		const userUpvoted = new Set<string>();
		for (const u of upvotes as any[]) {
			const su = (u as any).suggestion.uuid;
			upvoteCounts.set(su, (upvoteCounts.get(su) || 0) + 1);
			if ((u as any).user.uuid === user.uuid) userUpvoted.add(su);
		}
		const commentCounts = new Map<string, number>();
		for (const c of comments as any[]) {
			const su = (c as any).suggestion.uuid;
			commentCounts.set(su, (commentCounts.get(su) || 0) + 1);
		}
		return { upvoteCounts, userUpvoted, commentCounts };
	}
} 