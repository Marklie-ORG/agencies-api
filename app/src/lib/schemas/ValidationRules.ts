import { z } from "zod";
import {
  AdAccountsCurrencyRequestSchema,
  CancelSubscriptionRequestSchema,
  ChangeEmailRequestSchema,
  ChangePasswordRequestSchema,
  CreateClientFacebookAdAccountRequestSchema,
  CreateClientRequestSchema,
  CreateFeatureCommentRequestSchema,
  CreateFeatureSuggestionRequestSchema,
  CreateOrganizationRequestSchema,
  DeleteClientFacebookAdAccountRequestSchema,
  HandleFacebookLoginRequestSchema,
  HandleSlackLoginRequestSchema,
  ImpersonateUserRequestSchema,
  LoginRequestSchema,
  RefreshRequestSchema,
  RegistrationRequestSchema,
  RequestClientAccessRequestSchema,
  SaveAnswerRequestSchema,
  SendFeedbackRequestSchema,
  SendMessageToSlackRequestSchema,
  SendMessageWithFileToSlackRequestSchema,
  SendPasswordRecoveryEmailRequestSchema,
  SetActiveOrganizationSchema,
  SetSlackConversationIdRequestSchema,
  SetSlackWorkspaceTokenRequestSchema,
  ShareClientDatabaseRequestSchema,
  SubscribeRequestSchema,
  ToggleFeatureUpvoteRequestSchema,
  UpdateClientRequestSchema,
  UpdateNameRequestSchema,
  UpdateSubscriptionRequestSchema,
  UseInviteCodeRequestSchema,
  VerifyClientAccessRequestSchema,
  VerifyEmailChangeRequestSchema,
  VerifyPasswordRecoveryRequestSchema,
} from "./schemas.js";
import type { ValidationRule } from "marklie-ts-core";

export const agenciesValidationRules: ValidationRule[] = [
  // Auth endpoints
  { path: "/api/auth/register", schema: RegistrationRequestSchema },
  { path: "/api/auth/login", schema: LoginRequestSchema },
  { path: "/api/auth/refresh", schema: RefreshRequestSchema },

  {
    path: "/api/ad-accounts/currency",
    schema: AdAccountsCurrencyRequestSchema,
  },

  // User endpoints
  {
    path: "/api/user/active-organization",
    schema: SetActiveOrganizationSchema,
  },
  { path: "/api/user/name", schema: UpdateNameRequestSchema },
  {
    path: "/api/user/handle-facebook-login",
    schema: HandleFacebookLoginRequestSchema,
  },
  {
    path: "/api/user/handle-slack-login",
    schema: HandleSlackLoginRequestSchema,
  },
  {
    path: "/api/user/send-change-email-email",
    schema: ChangeEmailRequestSchema,
  },
  {
    path: "/api/user/verify-email-change",
    schema: VerifyEmailChangeRequestSchema,
  },
  { path: "/api/user/change-password", schema: ChangePasswordRequestSchema },
  { path: "/api/user/impersonate", schema: ImpersonateUserRequestSchema },
  {
    path: "/api/user/send-password-recovery-email",
    schema: SendPasswordRecoveryEmailRequestSchema,
  },
  {
    path: "/api/user/verify-password-recovery",
    schema: VerifyPasswordRecoveryRequestSchema,
  },
  { path: "/api/user/feedback", schema: SendFeedbackRequestSchema },

  // Onboarding endpoints
  { path: "/api/onboarding/answer", schema: SaveAnswerRequestSchema },

  // Organization endpoints
  { path: "/api/organizations", schema: CreateOrganizationRequestSchema },
  {
    path: "/api/organizations/invite-code",
    schema: UseInviteCodeRequestSchema,
  },
  {
    path: "/api/organizations/share-client-database",
    schema: ShareClientDatabaseRequestSchema,
  },
  {
    path: "/api/organizations/verify-client-access",
    schema: VerifyClientAccessRequestSchema,
  },
  {
    path: "/api/organizations/request-client-access",
    schema: RequestClientAccessRequestSchema,
  },

  // Client endpoints
  { path: "/api/clients", schema: CreateClientRequestSchema },
  { path: "/api/clients/:clientUuid", schema: UpdateClientRequestSchema },
  {
    path: "/api/clients/:clientUuid/ad-accounts",
    schema: CreateClientFacebookAdAccountRequestSchema,
  },
  {
    path: "/api/clients/:clientUuid/ad-accounts/:adAccountId",
    schema: DeleteClientFacebookAdAccountRequestSchema,
  },
  {
    path: "/api/clients/:clientUuid/slack/conversation-id",
    schema: SetSlackConversationIdRequestSchema,
  },
  {
    path: "/api/clients/:clientUuid/slack/send-message",
    schema: SendMessageToSlackRequestSchema,
  },
  {
    path: "/api/clients/:clientUuid/slack/workspace-token",
    schema: SetSlackWorkspaceTokenRequestSchema,
  },
  {
    path: "/api/clients/:clientUuid/slack/send-message-with-file",
    schema: SendMessageWithFileToSlackRequestSchema,
  },

  // Feature suggestions
  {
    path: "/api/feature-suggestions",
    schema: CreateFeatureSuggestionRequestSchema,
  },
  {
    path: "/api/feature-suggestions/comment",
    schema: CreateFeatureCommentRequestSchema,
  },
  {
    path: "/api/feature-suggestions/upvote",
    schema: ToggleFeatureUpvoteRequestSchema,
  },

  // Subscriptions
  { path: "/api/subscriptions/subscribe", schema: SubscribeRequestSchema },
  {
    path: "/api/subscriptions/update",
    schema: UpdateSubscriptionRequestSchema,
  },
  {
    path: "/api/subscriptions/cancel",
    schema: CancelSubscriptionRequestSchema,
  },
  { path: "/api/subscriptions/resume", schema: z.object({}) },
  { path: "/api/subscriptions/setup-intent", schema: z.object({}) },
  { path: "/api/subscriptions/webhook", schema: z.object({}) },
  { path: "/api/subscriptions/finalize/:session_id", schema: z.object({}) },
];
