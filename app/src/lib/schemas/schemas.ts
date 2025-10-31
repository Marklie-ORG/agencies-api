import z from "zod";

export const AdAccountsCurrencyRequestSchema = z.object({
  adAccountId: z.string().min(1, { message: "organizationName is required" }),
});

export const LoginRequestSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const RegistrationRequestSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const SetActiveOrganizationSchema = z.object({
  activeOrganizationUuid: z.uuid({ message: "Invalid organization UUID." }),
});

export const RefreshRequestSchema = z.object({});

export const UpdateNameRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const SaveAnswerRequestSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const CreateOrganizationRequestSchema = z.object({
  name: z.string(),
});

export const UseInviteCodeRequestSchema = z.object({
  code: z.string(),
});

export const HandleFacebookLoginRequestSchema = z.object({
  code: z.string(),
  redirectUri: z.string(),
});

export const CreateClientRequestSchema = z.object({
  name: z.string(),
  facebookAdAccounts: z.array(
    z.object({
      adAccountId: z.string(),
      adAccountName: z.string(),
      businessId: z.string(),
    }),
  ),
  emails: z.array(z.string()),
  phoneNumbers: z.array(z.string()),
});

export const CreateClientFacebookAdAccountRequestSchema = z.object({
  adAccountId: z.string(),
});

export const DeleteClientFacebookAdAccountRequestSchema = z.object({});

export const HandleSlackLoginRequestSchema = z.object({
  code: z.string(),
  redirectUri: z.string(),
  organizationClientId: z.string(),
});

export const SetSlackConversationIdRequestSchema = z.object({
  conversationId: z.string(),
});

export const SendMessageToSlackRequestSchema = z.object({
  message: z.string(),
});

export const SetSlackWorkspaceTokenRequestSchema = z.object({
  tokenId: z.string(),
});

export const SendMessageWithFileToSlackRequestSchema = z.object({
  message: z.string(),
});

export const UpdateClientRequestSchema = z.object({
  name: z.string().optional(),
  emails: z.array(z.string()).optional(),
  phoneNumbers: z.array(z.string()).optional(),
  facebookAdAccounts: z
    .array(
      z.object({
        adAccountId: z.string(),
        adAccountName: z.string(),
        businessId: z.string(),
      }),
    )
    .optional(),
});

export const ChangeEmailRequestSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const VerifyEmailChangeRequestSchema = z.object({
  token: z.string(),
});

export const ChangePasswordRequestSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const ImpersonateUserRequestSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export const SendPasswordRecoveryEmailRequestSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export const VerifyPasswordRecoveryRequestSchema = z.object({
  token: z.string(),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const SendFeedbackRequestSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty" }),
});

export const CreateFeatureSuggestionRequestSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
});

export const CreateFeatureCommentRequestSchema = z.object({
  suggestionUuid: z.uuid({ message: "Invalid suggestion UUID" }),
  comment: z.string().min(1, { message: "Comment cannot be empty" }),
});

export const ToggleFeatureUpvoteRequestSchema = z.object({
  suggestionUuid: z.uuid({ message: "Invalid suggestion UUID" }),
});

export const SubscribeRequestSchema = z.object({
  planId: z.string().min(1, "planId is required"),
  paymentMethodId: z.string().min(1).optional(),
  trialDays: z.number().int().positive().max(365).optional(),
});

export const UpdateSubscriptionRequestSchema = z.object({
  planId: z.string().min(1, "planId is required"),
  prorationBehavior: z.enum(["create_prorations", "none"]).optional(),
});

export const CancelSubscriptionRequestSchema = z.object({
  immediately: z.boolean().optional(),
});

export const ShareClientDatabaseRequestSchema = z.object({
  clientUuid: z.uuid({ message: "Invalid client UUID" }),
  emails: z.array(z.string()),
});

export const VerifyClientAccessRequestSchema = z.object({
  token: z.string(),
});

export const RequestClientAccessRequestSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  reportUuid: z.uuid({ message: "Invalid report UUID" }).optional(),
  clientUuid: z.uuid({ message: "Invalid client UUID" }).optional(),
});
