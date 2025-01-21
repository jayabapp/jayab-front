import { title } from "process";
import _STRINGS from "./LocalStrings";

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
export const headerBlackList = [
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
export const headerMobileBlackList = ["/chat"];

export const mobileFooterBlackList = ["/auth", "/auth/otp", "/auth/register"];

export const createPropertySteps = (id?: null | number) => [
  {
    full_title: "اطلاعات اصلی ملک",
    title: "اطلاعات عمومی",
    id: 1,
    link: `/profile/owner/properties/${id}/edit/initials?edit_mode=true`,
  },
  {
    full_title: "موقعیت مکانی ملک",
    title: "موقعیت مکانی",
    id: 2,
    link: `/profile/owner/properties/${id}/edit/location?edit_mode=true`,
  },
  {
    full_title: "تصاویر و ویدئو ملک",
    title: "تصاویر",
    id: 3,
    link: `/profile/owner/properties/${id}/edit/media?edit_mode=true`,
  },
  {
    full_title: "اطلاعات محیطی",
    title: "اطلاعات محیطی",
    id: 4,
    link: `/profile/owner/properties/${id}/edit/environment?edit_mode=true`,
  },
  {
    full_title: "اطلاعات اتاق و رخت خواب",
    title: "اتاق خواب",
    id: 5,
    link: `/profile/owner/properties/${id}/edit/bedroom?edit_mode=true`,
  },
  {
    full_title: "امکانات ملک",
    title: "امکانات",
    id: 6,
    link: `/profile/owner/properties/${id}/edit/facility?edit_mode=true`,
  },
  {
    full_title: "تعداد نفرات و قیمت ها",
    title: "ظرفیت",
    id: 7,
    link: `/profile/owner/properties/${id}/edit/price?edit_mode=true`,
  },
  {
    full_title: "اطلاعات دستیار مالک",
    title: "دستیار",
    id: 8,
    link: `/profile/owner/properties/${id}/edit/assistants?edit_mode=true`,
  },
  {
    full_title: "قوانین اقامتگاه",
    title: "قوانین",
    id: 9,
    link: `/profile/owner/properties/${id}/edit/terms?edit_mode=true`,
  },
];

export const SORT_TYPES = [
  { id: "new", title: "جدیدترین" },
  { id: "cheapest", title: "ارزان ترین" },
  { id: "expensive", title: "گران ترین" },
  { id: "best_sellers", title: "پرفروش ترین" },
];

export const allRoutes: { [key: string]: string } = {
  questions: "پرسش ها",
  s: "آگهی ها",
  advisors: "مشاوران",
  inquery: "استعلام هفتگی",
  authorize: "احراز  ملک",
  properties: "املاک",
  panel: "پنل مشاور",
  chat: "چت",
  owner: "مالک",
  blog: "بلاگ",
  blogs: "بلاگ",
  orders: "سفارشات",

  advisor: "مشاور",
  "is-especial": "مشاور ویژه",
  assistants: "افزودن دستیار مالک",
  initials: _STRINGS.REGISTER_PROPERTY,
  location: _STRINGS.SUBMIT_PROPERTY,
  media: _STRINGS.PROPERTY_MEDIA,
  facility: "امکانات ملک",
  subscription: "ارتقا آگهی و افزایش بازدید",
  price: _STRINGS.CAPS_N_PRICES,
  environment: "اطلاعات محیطی ملک",
  bedroom: "اطلاعات اتاق خواب، سرویس و حمام",

  license: "احراز ملک",
  podcasts: "پادکست ها",
  videos: "ویدیوها",
  "about-us": "درباره ما",
  branch: "اعطای نمایندگی",

  edit: "اطلاعات شخصی",

  support: "تیکت ",

  profile: "پروفایل",
  products: "محصولات",
  addresses: "آدرس ها",
  "contact-us": "تماس با ما",
  "categories-list": "دسته بندی ها",
  "legal-request": "ثبت درخواست حقوقی",
  "meeting-request": "درخواست ملاقات حضوری",
  terms: "قوانین و مقررات",
  "inquiry-list": "لیست استعلام",
  "online-lawyer": "وکیل آنلاین",
  faq: "سوالات متداول",
  cart: "سبد خرید",
  "repetitive-questions": "  سوالات متداول",

  checkout: "تکمیل فرآیند خرید",

  categories: "دسته بندی ها",
  compare: "لیست مقایسه",
  tracking: "پیگیری مرسوله",

  favorites: "علاقه مندی‌ها",

  comments: "دیدگاه‌ها",
  brands: "برند ها",
};

export const profileDropDownItems = [
  {
    id: 15,
    title: "آگهی های من",
    route: "/profile/owner/properties",
    imgSrc: "/assets/icons/header/header_my_adds.svg",
  },
  // { id: 21, title: "پیام های من", route: "/profile/chat", imgSrc: "/assets/icons/header/header_my_messages.svg" },
  {
    id: 421,
    title: "پرداخت های من",
    route: "/profile/turnovers",
    imgSrc: "/assets/icons/header/header_my_turnovers.svg",
  },
  {
    id: 123,
    title: "آگهی های ذخیره شده",
    route: "/profile/bookmarks",
    imgSrc: "/assets/icons/header/header_my_saves.svg",
  },
  { id: 23, title: "دعوت از دوستان", route: "/profile/edit", imgSrc: "/assets/icons/header/header_share.svg" },
  { id: 253, title: "پشتیبانی", route: "/profile/support", imgSrc: "/assets/icons/header/header_support.svg" },
];
export const menuDropDownItems = [
  { id: 115, title: "درباره ما", route: "/about-us", imgSrc: "/assets/icons/header/header_menu_about_us.svg" },
  { id: 230, title: "قوانین و مقررات", route: "/terms", imgSrc: "/assets/icons/header/header_menu_terms.svg" },
  { id: 251, title: "اخبار و مقالات", route: "/blog", imgSrc: "/assets/icons/header/header_menu_blog.svg" },
  { id: 1238, title: "سوالات متداول", route: "/faq", imgSrc: "/assets/icons/header/header_menu_faq.svg" },
  { id: 4261, title: "تماس با ما", route: "/contact-us", imgSrc: "/assets/icons/header/header_menu_call.svg" },
];

export const footerLinks = [
  { id: 241, title: "مقالات ", route: "/blog" },

  { id: 521, title: "سوالات متداول", route: "/faq" },
  { id: 246, title: "درباره ما", route: "/about-us" },
  { id: 227, title: "قوانین و مقررات", route: "/terms" },

  { id: 218, title: "تماس با ما", route: "/contact-us" },
];

export const profileItems = [
  // {
  //   id: 14124,
  //   title: "پیام های من",
  //   route: "/profile/chat",
  //   imgSrc: "/assets/icons/header/header_my_messages.svg",
  //   guard: true,
  //   isMobile: false,
  // },

  {
    id: 5232,
    title: "پرداخت های من",
    route: "/profile/turnovers",
    imgSrc: "/assets/icons/header/header_my_turnovers.svg",
    guard: true,
    isMobile: false,
  },
  {
    id: 769,
    title: "آگهی های ذخیره شده",
    route: "/profile/bookmarks",
    imgSrc: "/assets/icons/header/header_my_saves.svg",
    guard: true,
    isMobile: false,
  },

  {
    id: 42311124,
    title: "دعوت از دوستان",
    route: "/profile/invite",
    imgSrc: "/assets/icons/header/header_share.svg",
    guard: true,
    isMobile: false,
  },

  {
    id: 42324,
    title: "پشتیبانی",
    route: "/profile/support",
    imgSrc: "/assets/icons/header/header_support.svg",
    guard: true,
    isMobile: false,
  },
  {
    id: 2125232,
    title: "اخبار و مقالات",
    route: "/blogs",
    imgSrc: "/assets/icons/header/header_menu_blog.svg",
    isMobile: true,
  },
  {
    id: 212565232,
    title: "قوانین و مقررات",
    route: "/terms",
    imgSrc: "/assets/icons/header/header_menu_terms.svg",
    isMobile: true,
  },
  {
    id: 21232,
    title: "سوالات متداول",
    route: "/faq",
    guard: false,
    imgSrc: "/assets/icons/header/header_menu_faq.svg",
    isMobile: true,
  },
  {
    id: 2152625632,
    title: "درباره ما",
    route: "/about-us",
    imgSrc: "/assets/icons/header/header_menu_about_us.svg",
    guard: false,
    isMobile: true,
  },
  {
    id: 2531232,
    title: "تماس با ما",
    route: "/contact-us",
    imgSrc: "/assets/icons/header/header_menu_call.svg",
    guard: false,
    isMobile: true,
  },
];

export const WeekDays = [
  { title: "شنبه", id: 6 },
  { title: "یکشنبه", id: 0 },
  { title: "دوشنبه", id: 1 },
  { title: "سه شنبه", id: 2 },
  { title: "چهارشنبه", id: 3 },
  { title: "پنجشنبه", id: 4 },
  { title: "جمعه", id: 5 },
];

export const easyRatingItems = {
  100: { label: "عالی", style: { color: "#3886E5", bottom: "2rem" } },
  75: { label: "خوب", style: { color: "#3886E5", bottom: "2rem" } },
  50: { label: "متوسط", style: { color: "#3886E5", bottom: "2rem" } },
  25: { label: "ضعیف", style: { color: "#3886E5", bottom: "2rem" } },
};

export const poolFilterTypes = [
  { title: "فقط ملک‌های استخردار", id: 1 },
  { title: "فقط ملک‌های بدون استخر", id: 0 },
];
