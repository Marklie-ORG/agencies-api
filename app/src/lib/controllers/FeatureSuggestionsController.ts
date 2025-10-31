import Router from "@koa/router";
import type { Context } from "koa";
import { FeatureSuggestionsService } from "lib/services/FeatureSuggestionsService.js";
import type {
  CreateFeatureCommentRequest,
  CreateFeatureSuggestionRequest,
  ToggleFeatureUpvoteRequest,
} from "marklie-ts-core";

export class FeatureSuggestionsController extends Router {
  private readonly service = new FeatureSuggestionsService();

  constructor() {
    super({ prefix: "/api/feature-suggestions" });
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.get("/", this.list);
    this.post("/", this.create);
    this.get("/:uuid", this.getOne);
    this.post("/upvote", this.upvote);
    this.get("/:uuid/comments", this.getComments);
    this.post("/comment", this.comment);
  }

  private list = async (ctx: Context) => {
    const user = ctx.state.user;
    ctx.body = await this.service.getSuggestionsWithAggregates(user);
    ctx.status = 200;
  };

  private getOne = async (ctx: Context) => {
    const user = ctx.state.user;
    const { uuid } = ctx.params;
    ctx.body = await this.service.getSingleSuggestionWithAggregates(uuid, user);
    ctx.status = 200;
  };

  private create = async (ctx: Context) => {
    const { title, description } = ctx.request
      .body as CreateFeatureSuggestionRequest;
    const user = ctx.state.user;

    const suggestion = await this.service.createSuggestion(
      title,
      description,
      user,
    );

    ctx.body = { uuid: suggestion.uuid };
    ctx.status = 200;
  };

  private upvote = async (ctx: Context) => {
    const { suggestionUuid } = ctx.request.body as ToggleFeatureUpvoteRequest;
    const user = ctx.state.user;

    ctx.body = await this.service.toggleUpvote(suggestionUuid, user);
    ctx.status = 200;
  };

  private getComments = async (ctx: Context) => {
    const { uuid } = ctx.params;

    ctx.body = await this.service.getFormattedComments(uuid);
    ctx.status = 200;
  };

  private comment = async (ctx: Context) => {
    const { suggestionUuid, comment } = ctx.request
      .body as CreateFeatureCommentRequest;
    const user = ctx.state.user;

    const newComment = await this.service.addComment(
      suggestionUuid,
      comment,
      user,
    );
    ctx.body = { uuid: newComment.uuid };
    ctx.status = 200;
  };
}
