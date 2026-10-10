import type { Translate } from "@/types/i18n";

export const connectingWhiteList = ["/chat"];
export const footerBlacklist = [
  "/auth",
  "/new-post",
  "/auth/sign-in",
  "/auth/sign-in/forgot-password",
  "/auth/sign-up",
  "/auth/sign-up/otp",
  "/auth/sign-in/otp",
  "/auth/sign-in/change-password",
  "/auth/verify",

  "/post/[id]",
  "/auth/otp",
  "/products/[parentId]",
  "/profile/notifications",

  "/PagesByGroup",

  "/chat/[id]",

  "/chat",

  "/auth/register",
  "/auth/register/upload-documents",
  "/auth/register/terms",
  "/auth/register/success",
  "/profile",
];

export const guardedDirectories = ["/chat/", "/profile/"];
export const guardedDirectoriesExceptions = ["/profile/support"];

export const headerBlackList = [
  "/qa-login",
  "/auth",
  "/new-post",
  "/auth/sign-in",
  "/auth/sign-in/forgot-password",
  "/auth/sign-up",
  "/auth/sign-up/otp",
  "/auth/sign-in/otp",
  "/auth/sign-in/change-password",
  "/auth/verify",

  "/post/[id]",
  "/auth/otp",
  "/products/[parentId]",
  "/profile/notifications",

  "/PagesByGroup",

  "/auth/register",
  "/auth/register/upload-documents",
  "/auth/register/terms",
  "/auth/register/success",
];
export const headerMobileSearchBlackList = ["/chat"];

export const mobileHeaderBlackList = [
  "/chat/",
  "/auth",
  "/auth/otp",
  "/auth/register",
  "/profile/owner/properties",
  "/profile/advisor",
];
export const headerWithFullSeach = ["/rooms"];
export const mobileFooterBlackList = [
  // "/chat/",
  "/profile/edit",
  "/profile/support/",
  "/qa-login",
];

export const mobileNavHiddenBlackList = ["/rooms/"];

export const footerHiddenBlackList = [
  "/chat/",
  "/auth",
  "/qa-login",
  "/profile/owner/properties/",
  "/profile/advisor/subscription/",
];

export const createPropertySteps = (
  id: null | number | undefined,
  t: Translate,
) => [
  {
    full_title: t("owner.stepMainInfo"),
    title: t("owner.stepGeneral"),
    id: 1,
    link: `/profile/owner/properties/${id}/edit/initials?edit_mode=true`,
  },
  {
    full_title: t("owner.stepLocationFull"),
    title: t("owner.stepLocation"),
    id: 2,
    link: `/profile/owner/properties/${id}/edit/location?edit_mode=true`,
  },
  {
    full_title: t("owner.stepPhotosFull"),
    title: t("owner.stepPhotos"),
    id: 3,
    link: `/profile/owner/properties/${id}/edit/media?edit_mode=true`,
  },
  {
    full_title: t("owner.stepEnvironment"),
    title: t("owner.stepEnvironment"),
    id: 4,
    link: `/profile/owner/properties/${id}/edit/environment?edit_mode=true`,
  },
  {
    full_title: t("owner.stepRoomsFull"),
    title: t("owner.stepRooms"),
    id: 5,
    link: `/profile/owner/properties/${id}/edit/bedroom?edit_mode=true`,
  },
  {
    full_title: t("owner.stepAmenitiesFull"),
    title: t("owner.stepAmenities"),
    id: 6,
    link: `/profile/owner/properties/${id}/edit/facility?edit_mode=true`,
  },
  {
    full_title: t("owner.stepCapacityFull"),
    title: t("owner.stepCapacity"),
    id: 7,
    link: `/profile/owner/properties/${id}/edit/price?edit_mode=true`,
  },
  {
    full_title: t("owner.stepAssistantFull"),
    title: t("owner.stepAssistant"),
    id: 8,
    link: `/profile/owner/properties/${id}/edit/assistants?edit_mode=true`,
  },
  {
    full_title: t("owner.stepRulesFull"),
    title: t("owner.stepRules"),
    id: 9,
    link: `/profile/owner/properties/${id}/edit/terms?edit_mode=true`,
  },
];

export const SORT_TYPES = [
  {
    id: "newset",
    titleKey: "listing.sortNewest",
    icon: "/assets/icons/sort/sort_newest.svg",
  },
  {
    id: "popular",
    titleKey: "listing.sortPopular",
    icon: "/assets/icons/sort/sort_star.svg",
  },
  {
    id: "price_desc",
    titleKey: "listing.sortPriceDesc",
    icon: "/assets/icons/sort/sort_expensive.svg",
  },
  {
    id: "price_asc",
    titleKey: "listing.sortPriceAsc",
    icon: "/assets/icons/sort/sort_piggy_banl.svg",
  },
  {
    id: "commission_desc",
    titleKey: "listing.sortCommission",
    icon: "/assets/icons/sort/sort_most_comision.svg",
  },
] as const;
// Segments that have a title in messages `routes.<segment>`. Membership is checked
// here (not with t.has) because URL segments are user input.
export const routeTitleKeys = [
  "test-access",
  "questions",
  "notifications",
  "rooms",
  "invite",
  "my-payments",
  "advisors",
  "inquery",
  "authorize",
  "properties",
  "bookmarks",
  "panel",
  "chat",
  "owner",
  "blog",
  "blogs",
  "orders",
  "reserves",
  "advisor",
  "is-especial",
  "assistants",
  "initials",
  "location",
  "media",
  "facility",
  "subscription",
  "price",
  "is-not-especial",
  "environment",
  "bedroom",
  "license",
  "podcasts",
  "videos",
  "about-us",
  "branch",
  "requests",
  "edit",
  "support",
  "profile",
  "products",
  "addresses",
  "contact-us",
  "photo-upgrade-requests",
  "categories-list",
  "legal-request",
  "meeting-request",
  "terms",
  "inquiry-list",
  "online-lawyer",
  "faq",
  "cart",
  "repetitive-questions",
  "checkout",
  "categories",
  "compare",
  "tracking",
  "favorites",
  "comments",
  "brands",
] as const;
export type RouteTitleKey = (typeof routeTitleKeys)[number];
export const isRouteTitleKey = (segment: string): segment is RouteTitleKey =>
  (routeTitleKeys as readonly string[]).includes(segment);

export const profileDropDownItems = [
  // { id: 21, title: "پیام های من", route: "/profile/chat", imgSrc: "/assets/icons/header/header_my_messages.svg" },
  {
    id: 421,
    titleKey: "myPayments",
    route: "/profile/my-payments",
    imgSrc: "/assets/icons/header/header_my_turnovers.svg",
  },
  {
    id: 112423,
    titleKey: "myReserves",
    route: "/profile/reserves",
    imgSrc: "/assets/icons/adds/header_reserve.svg",
  },
  {
    id: 123,
    titleKey: "savedListings",
    route: "/profile/bookmarks",
    imgSrc: "/assets/icons/header/header_my_saves.svg",
  },
  {
    id: 23,
    titleKey: "inviteFriends",
    route: "/profile/invite",
    imgSrc: "/assets/icons/header/header_share.svg",
  },
  {
    id: 253,
    titleKey: "support",
    route: "/profile/support",
    imgSrc: "/assets/icons/header/header_support.svg",
  },
] as const;
export const footerLinks = [
  { id: 241, titleKey: "blog", route: "/blog" },

  { id: 521, titleKey: "faq", route: "/faq" },
  { id: 246, titleKey: "about", route: "/about-us" },
  { id: 227, titleKey: "terms", route: "/terms" },

  { id: 218, titleKey: "contact", route: "/contact-us" },
] as const;

export const profileItems = [
  {
    id: 1251769,
    titleKey: "header.myReserves",
    route: "/profile/reserves",
    imgSrc: "/assets/icons/adds/header_reserve.svg",
    guard: true,
    isMobile: false,
  },
  {
    id: 769,
    titleKey: "header.savedListings",
    route: "/profile/bookmarks",
    imgSrc: "/assets/icons/header/header_my_saves.svg",
    guard: true,
    isMobile: false,
  },

  {
    id: 42311124,
    titleKey: "header.inviteFriends",
    route: "/profile/invite",
    imgSrc: "/assets/icons/header/header_share.svg",
    guard: true,
    isMobile: false,
  },

  {
    id: 42324,
    titleKey: "header.support",
    route: "/profile/support",
    imgSrc: "/assets/icons/header/header_support.svg",
    guard: false,
    isMobile: false,
  },
  {
    id: 2125232,
    titleKey: "routes.blog",
    route: "/blog",
    imgSrc: "/assets/icons/header/header_menu_blog.svg",
    isMobile: true,
  },
  {
    id: 212565232,
    titleKey: "routes.terms",
    route: "/terms",
    imgSrc: "/assets/icons/header/header_menu_terms.svg",
    isMobile: true,
  },
  {
    id: 21232,
    titleKey: "routes.faq",
    route: "/faq",
    guard: false,
    imgSrc: "/assets/icons/header/header_menu_faq.svg",
    isMobile: true,
  },
  {
    id: 2152625632,
    titleKey: "routes.about-us",
    route: "/about-us",
    imgSrc: "/assets/icons/header/header_menu_about_us.svg",
    guard: false,
    isMobile: true,
  },
  {
    id: 2531232,
    titleKey: "routes.contact-us",
    route: "/contact-us",
    imgSrc: "/assets/icons/header/header_menu_call.svg",
    guard: false,
    isMobile: true,
  },
] as const;

export const poolFilterTypes = [
  { titleKey: "listing.onlyWithPool", id: 1 },
  { titleKey: "listing.onlyNoPool", id: 0 },
] as const;
export const shareLinks = [
  {
    id: 0,
    icon: "/assets/icons/share/telegram.svg",
    link: (address: string) =>
      `https://t.me/share/url?url=${address}&text=${address}`,
  },
  {
    id: 1,
    icon: "/assets/icons/share/whatsapp.svg",
    link: (address: string) => `https://api.whatsapp.com/send?text=${address}`,
  },
];

export const shareButtonItems = [
  {
    titleKey: "listing.shareImages",
    icon: "/assets/icons/share/blue_pic.svg",
    id: "1",
  },
  {
    titleKey: "listing.shareInfo",
    icon: "/assets/icons/share/blue_exclemation.svg",
    id: "2",
  },
  {
    titleKey: "listing.shareLocation",
    icon: "/assets/icons/adds/blue_pinpoint_location.svg",
    id: "3",
  },
] as const;

export const titlePlaceholderExamples = (t: Translate) =>
  [1, 2, 3, 4, 5, 6, 7].map((index) => t(`owner.titleExample${index}`));

export const chartSteps = {
  1: [0, 10],
  2: [11, 20],
  3: [21, 30],
  4: [31, 40],
  5: [41, 50],
  6: [51, 60],
  7: [61, 70],
  8: [71, 80],
  9: [81, 90],
  10: [91, 100],
};

export const sortDynamicFiltersInOrder = [
  "PROPERTY_TYPE",
  "POOL_TYPE",
  "PATTERN",
  "ENTERTAINMENT",
  "WELFARE",
  "COOL_HEAT",
  "KITCHEN",
  "OWNERSHIP",
];

export const zero_filter_remove_keys = ["total_guests", "total_bedrooms"];

export const PROPERTY_GRID_COLS_CLASS =
  "grid-cols-[repeat(auto-fit,minmax(min(21.25rem,100%),1fr))]";

export const DEFAULT_GRID_CLASS = `grid gap-2 overflow-hidden px-1 pb-8 pt-4 md:gap-4 md:pt-2 ${PROPERTY_GRID_COLS_CLASS}`;

export const GRID_CLASS = `grid pb-8 pt-4 md:pt-2 px-3 lg:px-1 !overflow-hidden gap-2 md:gap-4 ${PROPERTY_GRID_COLS_CLASS}`;

export const DEFAULT_GRID_CLASS_PROPERTY = `grid gap-2 px-3 pt-4 md:gap-4 ${PROPERTY_GRID_COLS_CLASS}`;
