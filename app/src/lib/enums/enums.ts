export enum FACEBOOK_DATE_PRESETS {
  TODAY = "today",
  YESTERDAY = "yesterday",
  THIS_MONTH = "this_month",
  LAST_MONTH = "last_month",
  THIS_QUARTER = "this_quarter",
  LAST_QUARTER = "last_quarter",
  THIS_YEAR = "this_year",
  LAST_YEAR = "last_year",
  LAST_3D = "last_3d",
  LAST_7D = "last_7d",
  LAST_14D = "last_14d",
  LAST_28D = "last_28d",
  LAST_30D = "last_30d",
  LAST_90D = "last_90d",
  MAXIMUM = "maximum",
}

export enum OrganizationRole {
  OWNER = "owner",
  EDITOR = "editor",
  READER = "reader",
}

export enum OrganizationTokenType {
  FACEBOOK = "facebook",
  TIKTOK = "tiktok",
}

export enum TokenExpiration {
  ACCESS = 60 * 60,
  REFRESH = 356 * 24 * 60 * 60,
}

export enum CommunicationChannelType {
  EMAIL = "email",
  SLACK = "slack",
  WHATSAPP = "whatsapp",
}
