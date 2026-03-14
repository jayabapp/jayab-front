export const Url = process.env.NEXT_PUBLIC_BASE_URL;
export const baseUrl = `${Url}/api/v1`;
export const imageUrl = `${Url}/`;
export const NEW_IMAGE_URL = (
  item?: { bucket: string; end_point: string; path: string; name: string; thumbnail: string; medium: string } | null,
  keyValue?: "name" | "thumbnail" | "medium",
) => {
  if (item?.bucket && item?.bucket != null)
    return `https://${item?.bucket}.${item?.end_point}/${item?.path}/${keyValue ? item[keyValue] : item?.name}`;
  else return "/assets/icons/logo/logo.svg";
};
export const imageUrlBase = `${Url}/images/contents/`;
export const IMAGE_URL = (path: string) => `${Url}/${path}`;
export const bankUrl = (path: string) => `${Url}/images/bank/${path}`;

export const apiRoutes = {
  AU1: "/auth/otp",

  AU2: "/auth/otp/verify",

  AU3: "/user/register",

  AU4: "/profile",

  AU5: "/user/national-card/upload",

  AU6: "/user/legal/person",

  AU7: "/business/login",

  AU8: "/user/auth/set-password",

  AU9: "/user/auth/login",

  AU10: "/user/auth/register",

  AU12: "/user/forget-password/code/send",

  AU13: "/user/forget-password/code/verify",

  AU14: "/user/forget-password/reset",

  AUTH_INIT: "/auth/init-user",

  APP_SETTINGS: "/auth/init-settings",

  PROFILE_UPLOAD: "/attachments",

  REGISTER_OWNER: "/profile/register/owner",

  GET_OWNER_PROFILE: "/profile/owner",

  USER_PROP_OPTIONS: "/user/property-options",

  CITIES: "/cities",

  USER_SUBSCRIPTION_PLANS: "/user/subscription-plans",

  GET_PROPERTIES: "/user/properties",

  CONTENTS_QUESTIONS: `/content-questions`,

  SETTING_SITEMAP: `/settings/sitemap`,

  SETTING_ROBOTS: `/settings/robots`,

  SEARCH_SUGGS: `/user/properties/search/suggestions`,

  CONTENTS: `/contents`,

  OWNER_PROPERTIES_LIST: "/owner/properties",

  OWNER_PROPERTIES_AUTHORIZE: "/owner/property-authorize",

  CHAT: "/chat",

  UNREAD_CHAT_COUNT: "/chat/unread/count",

  NOTIFS: `/user/notifications`,

  NOTIFS_BADGE: `/user/notifications/badge`,

  FAVS: `/user/favorites`,

  BOOKMARKS: `/user/bookmarks`,

  BANNERS: "/banners",

  USER_LANDING_PAGES: "/user/landing-pages",

  PROFILE_REGISTER_ADVISORS: `/profile/register/advisor`,

  PAY_ADVISOR_PLAN: `/profile/pay-plan`,

  USER_ADVISORS: `/user/advisors`,

  USER_ADVISORS_PROFILE: `/profile/advisor`,

  TICKETS: `/user/tickets`,

  USER_SUBSCRIPTIONS: `/user/subscriptions`,

  UPDATE_FCM: "/profile/update-fcm",

  UPDATE_PROFILE_IMAGE: "/profile/profile-image",

  ADMIN_EDIT_VALIDATE: `/admin/auth/validate-edit-mode`,

  RESERVE: "/reserves",

  OWNER_RESERVE: "/owner/reserves",

  CANCEL_RESERVE: (propertyReserveId: string | number) => `/reserves/${propertyReserveId}`,

  OWNER_CALL_RESERVE_REQUEST: (propertyReserveId: string | number) =>
    `/owner/reserves/${propertyReserveId}/events/click-guest-mobile`,

  PROPERTY_REPORT: (postId: string | number) => `/user/property-reports/${postId}`,

  SINGLE_TICKET_GET: (id: string | number) => `/user/tickets/${id}`,

  SINGLE_PROPERTY_CONTACT_INFO: (propertySlug: string | number | null) =>
    `/user/properties/${propertySlug}/contact-info`,

  SINGLE_PROPERTY_ADVISOR_SHARE: (propertyId: string | number | null) =>
    `/user/properties/${propertyId}/advisor-share/link`,

  SINGLE_USER_LANDING_PAGE: (landingPageUrl: string | number) => `/user/landing-pages/${landingPageUrl}`,

  OWNER_PROP_INIT: (propertyId?: string | number | null) =>
    `/owner/properties/init${!!propertyId ? `?property_id=${propertyId}` : ""}`,

  SINGLE_ADVISOR: (advisorId?: string | number | null) => `/user/advisors/${advisorId}`,

  SINGLE_ADVISOR_INIT_RATE: (advisorId?: string | number | null) => `/user/advisors/${advisorId}/rate/init`,

  SINGLE_ADVISOR_RATE: (advisorId?: string | number | null) => `/user/advisors/${advisorId}/rate/add`,

  OWNER_PROPERTIES: (propertyId: string | number | null) => `/owner/properties/${propertyId}`,

  OWNER_PROPERTIES_STATUS_UPDATE: (propertyId: string | number | null) =>
    `/owner/properties/${propertyId}/calendar/reserves`,

  OWNER_PROPERTIES_PRICE_RANGE_UPDATE: (propertyId: string | number | null) =>
    `/owner/properties/${propertyId}/calendar/price`,

  OWNER_PROPERTIES_PRICE_UPDATE: (propertyId: string | number | null) =>
    `/owner/properties/${propertyId}/calendar/price`,

  OWNER_PROPERTIES_ALL_DAYS_COMMISSION_UPDATE: (propertyId: string | number | null) =>
    `/owner/properties/${propertyId}/commission`,

  OWNER_PROPERTIES_COMMISSION_UPDATE: (propertyId: string | number | null) =>
    `/owner/properties/${propertyId}/calendar/commission`,

  OWNER_PROPERTIES_CALLENDARE_NOTE_UPDATE: (propertyId: string | number | null) =>
    `/owner/properties/${propertyId}/calendar/notes`,

  OWNER_PROPERTIES_SINGLE_CALLENDAR: (propertyId: string | number | null) =>
    `/owner/properties/${propertyId}/month-calendar`,

  OWNER_PROPERTIES_SINGLE_BADGE: (propertyId: string | number | null) =>
    `/owner/properties/${propertyId}/property-badges`,

  OWNER_PROPERTIES_SINGLE_AUTH: (propertyId: string | number | null) => `/owner/property-authorize/${propertyId}`,

  OWNER_PROPERTIES_PAY_SUBS: (propertyId: string | number | null) => `/owner/properties/${propertyId}/pay-subscription`,

  OWNER_PROPERTIES_LOC_UPDATE: (propertyId: string | number | null) => `/owner/properties/${propertyId}/location`,

  OWNER_PROPERTIES_MEDIA_UPDATE: (propertyId: string | number | null) => `/owner/properties/${propertyId}/media`,

  OWNER_PROPERTIES_ENV_UPDATE: (propertyId: string | number | null) => `/owner/properties/${propertyId}/environment`,

  OWNER_PROPERTIES_ENV_FACILITY: (propertyId: string | number | null) => `/owner/properties/${propertyId}/facility`,

  OWNER_PROPERTIES_ENV_PRICE: (propertyId: string | number | null) => `/owner/properties/${propertyId}/price`,

  OWNER_PROPERTIES_ENV_ASSISTANT: (propertyId: string | number | null) => `/owner/properties/${propertyId}/assistants`,

  OWNER_PROPERTIES_ENV_TERMS: (propertyId: string | number | null) => `/owner/properties/${propertyId}/terms`,

  OWNER_PROPERTIES_ENV_BEDROOM: (propertyId: string | number | null) => `/owner/properties/${propertyId}/bedroom`,

  SINGLE_OWNER_PROPERTY: (propertyId: string | number | null) => `/owner/properties/${propertyId}`,

  SINGLE_OWNER_PROPERTY_STATS: (propertyId: string | number | null) => `/owner/properties/${propertyId}/statistics`,

  SINGLE_PROPERTY_UPDATE_VIEW: (propertyId: string | number | null) => `/user/properties/${propertyId}/view`,

  CITIES_CHILDEREN: (parentId: string | number) => `/cities/${parentId}`,

  CONTENT_BY_KEY: (id: string | number) => `/contents/by-key/${id}`,

  GET_SINGLEPROPERTY_SlUG: (propertySlug: string | number) => `/user/properties/${propertySlug}`,

  GET_SINGLEPROPERTY_CALLENDER: (propertyId: string | number | null) => `/user/properties/${propertyId}/month-calendar`,

  /* -------------------------------------------------------------------------- */
  /*                                    CHAT                                    */
  /* -------------------------------------------------------------------------- */

  SEND_MESSAGE: (chatroomId: number | string) => `/chat/${chatroomId}/send-message`,

  READ_MESSAGE: (chatroomId: number | string) => `/chat/${chatroomId}/read-at`,

  BLOCK_CHAT: (chatroomId?: number | string) => `/chat/${chatroomId}/blacklist`,

  DELETE_MESSAGE: (chatroomId: number | string, messageId: number | string) =>
    `/chat/${chatroomId}/messages/${messageId}`,

  GET_SNGLE_CHAT_MESSAGES: (chatroomId: number | string, cursor: number | string) =>
    `/chat/${chatroomId}/messages?cursor=${cursor}`,

  GET_SNGLE_CHAT: (chatroomId: number | string) => `/chat/${chatroomId}`,

  SINGLE_CONTENT_WITH_SLUG: (slug: number | string) => `/contents/by-slug/${slug}`,

  REDIRECT_CHECK: (url: string) => `/user/redirect-urls/${url}`,

  SINGLE_CONTENT_CATEGORY: (slug: number | string) => `/contents/category/${slug}`,
};
