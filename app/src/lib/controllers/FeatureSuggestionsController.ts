import Router from "koa-router";
import type { Context } from "koa";
import { FeatureSuggestionsService } from "lib/services/FeatureSuggestionsService.js";

export class FeatureSuggestionsController extends Router {
	private readonly service: FeatureSuggestionsService;
	constructor() {
		super({ prefix: "/api/feature-suggestions" });
		this.service = new FeatureSuggestionsService();
		this.setUpRoutes();
	}

	private setUpRoutes() {
		this.get("/", this.list.bind(this));
		this.post("/", this.create.bind(this));
		this.get("/:uuid", this.getOne.bind(this));
		this.post("/upvote", this.upvote.bind(this));
		this.get("/:uuid/comments", this.getComments.bind(this));
		this.post("/comment", this.comment.bind(this));
	}

	private async list(ctx: Context) {
		const user = ctx.state.user;
		const suggestions = await this.service.listSuggestions();
		const aggregates = await this.service.getAggregatesFor(user, suggestions as any);
		ctx.body = (suggestions as any).map((s: any) => ({
			uuid: s.uuid,
			title: s.title,
			description: s.description,
			createdAt: s.createdAt,
			updatedAt: s.updatedAt,
			user: {
				uuid: s.user.uuid,
				firstName: s.user.firstName,
				lastName: s.user.lastName,
				email: s.user.email,
			},
			organizationUuid: s.organization.uuid,
			upvotes: aggregates.upvoteCounts.get(s.uuid) || 0,
			userHasUpvoted: aggregates.userUpvoted.has(s.uuid),
			commentsCount: aggregates.commentCounts.get(s.uuid) || 0,
		}));
		ctx.status = 200;
	}

	private async getOne(ctx: Context) {
		const user = ctx.state.user;
		const { uuid } = ctx.params as any;
		const suggestion = await this.service.findSuggestion(uuid);
		const aggregates = await this.service.getAggregatesFor(user, [suggestion] as any);
		const s: any = suggestion;
		ctx.body = {
			uuid: s.uuid,
			title: s.title,
			description: s.description,
			createdAt: s.createdAt,
			updatedAt: s.updatedAt,
			user: {
				uuid: s.user.uuid,
				firstName: s.user.firstName,
				lastName: s.user.lastName,
				email: s.user.email,
			},
			organizationUuid: s.organization.uuid,
			upvotes: aggregates.upvoteCounts.get(s.uuid) || 0,
			userHasUpvoted: aggregates.userUpvoted.has(s.uuid),
			commentsCount: aggregates.commentCounts.get(s.uuid) || 0,
		};
		ctx.status = 200;
	}

	private async create(ctx: Context) {
		const { title, description } = ctx.request.body as { title: string; description: string };
		const user = ctx.state.user;
		const s = await this.service.createSuggestion(title, description, user);
		ctx.body = { uuid: (s as any).uuid, message: "Suggestion created" };
		ctx.status = 200;
	}

	private async upvote(ctx: Context) {
		const { suggestionUuid } = ctx.request.body as { suggestionUuid: string };
		const user = ctx.state.user;
		const result = await this.service.toggleUpvote(suggestionUuid, user);
		ctx.body = result;
		ctx.status = 200;
	}

	private async getComments(ctx: Context) {
		const user = ctx.state.user;
		const { uuid } = ctx.params as any;
		const comments = await this.service.getComments(uuid, user);
		ctx.body = (comments as any).map((c: any) => ({
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
		ctx.status = 200;
	}

	private async comment(ctx: Context) {
		const { suggestionUuid, comment } = ctx.request.body as { suggestionUuid: string; comment: string };
		const user = ctx.state.user;
		const c = await this.service.addComment(suggestionUuid, comment, user);
		ctx.body = { uuid: (c as any).uuid, message: "Comment added" };
		ctx.status = 200;
	}
} 