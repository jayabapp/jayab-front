import _STRINGS from "./LocalStrings";

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
export const headerMobileSearchBlackList = ["/chat"];

export const mobileHeaderBlackList = ["/chat/"];
export const mobileFooterBlackList = [
  "/auth",
  "/auth/otp",
  "/auth/register",
  "/profile/owner/properties",
  "/chat/",
  "/profile/advisor",
  // "/profile/",
];

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
    full_title: "تصاویر  ملک",
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
    full_title: "اطلاعات دستیار میزبان",
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
  { id: "newset", title: "جدیدترین", icon: "/assets/icons/sort/sort_newest.svg" },
  { id: "popular", title: "محبوب ترین", icon: "/assets/icons/sort/sort_star.svg" },
  { id: "price_desc", title: "گران ترین", icon: "/assets/icons/sort/sort_expensive.svg" },
  { id: "price_asc", title: "ارزان ترین", icon: "/assets/icons/sort/sort_piggy_banl.svg" },
  { id: "commission_desc", title: "بیشترین کمیسیون", icon: "/assets/icons/sort/sort_most_comision.svg" },
];
export const allRoutes: { [key: string]: string } = {
  questions: "پرسش ها",
  notifications: "اعلان ها",
  rooms: "آگهی ها",
  invite: "دعوت از دوستان",
  "my-payments": "پرداخت های من",
  advisors: "مشاوران",
  inquery: "استعلام هفتگی",
  authorize: "احراز  ملک",
  properties: "املاک",
  bookmarks: "آگهی های ذخیره شده",
  panel: "پنل مشاور",
  chat: "پیام ها",
  owner: "مالک",
  blog: "بلاگ",
  blogs: "بلاگ",
  orders: "سفارشات",
  reserves: "رزرو های من",
  advisor: "مشاور",
  "is-especial": "مشاور ویژه",
  assistants: "افزودن دستیار میزبان",
  initials: _STRINGS.REGISTER_PROPERTY,
  location: _STRINGS.SUBMIT_PROPERTY,
  media: _STRINGS.PROPERTY_MEDIA,
  facility: "امکانات ملک",
  subscription: "ارتقا آگهی و افزایش بازدید",
  price: _STRINGS.CAPS_N_PRICES,
  "is-not-especial": "مشاور",
  environment: "اطلاعات محیطی ملک",
  bedroom: "اطلاعات اتاق خواب، سرویس و حمام",

  license: "احراز ملک",
  podcasts: "پادکست ها",
  videos: "ویدیوها",
  "about-us": "درباره ما",
  branch: "اعطای نمایندگی",
  requests: "درخواست ها",
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
  // { id: 21, title: "پیام های من", route: "/profile/chat", imgSrc: "/assets/icons/header/header_my_messages.svg" },
  {
    id: 421,
    title: "پرداخت های من",
    route: "/profile/my-payments",
    imgSrc: "/assets/icons/header/header_my_turnovers.svg",
  },
  {
    id: 123,
    title: "آگهی های ذخیره شده",
    route: "/profile/bookmarks",
    imgSrc: "/assets/icons/header/header_my_saves.svg",
  },
  { id: 23, title: "دعوت از دوستان", route: "/profile/invite", imgSrc: "/assets/icons/header/header_share.svg" },
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

  // {
  //   id: 5232,
  //   title: "پرداخت های من",
  //   route: "/profile/my-payments",
  //   imgSrc: "/assets/icons/header/header_my_turnovers.svg",
  //   guard: true,
  //   isMobile: false,
  // },
  {
    id: 1251769,
    title: "رزرو های من",
    route: "/profile/reserves",
    imgSrc: "/assets/icons/header/header_my_saves.svg",
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
    route: "/blog",
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
export const simpleWeekDays = ["یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

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
export const shareLinks = [
  {
    id: 0,
    icon: "/assets/icons/share/telegram.svg",
    link: (address: string) => `https://t.me/share/url?url=${address}&text=${address}`,
  },
  {
    id: 1,
    icon: "/assets/icons/share/whatsapp.svg",
    link: (address: string) => `https://api.whatsapp.com/send?text=${address}`,
  },
  // {
  //   id: 2,
  //   icon: "/assets/icons/share/twitter.svg",
  //   link: (address: string) => `https://twitter.com/intent/tweet?text=${address}&hashtags=digihagh`,
  // },
  // {
  //   id: 3,
  //   icon: "/assets/icons/share/linkdin.svg",
  //   link: (address: string) => `https://www.linkedin.com/shareArticle?mini=true&title=دیجی حق&url=${address}`,
  // },
];

export const shareButtonItems = [
  { title: "اشتراک گذاری تصاویر", icon: "/assets/icons/share/blue_pic.svg", id: "1" },
  { title: "اشتراک گذاری اطلاعات", icon: "/assets/icons/share/blue_exclemation.svg", id: "2" },
  { title: "اشتراک گذاری موقعیت مکانی", icon: "/assets/icons/adds/blue_pinpoint_location.svg", id: "3" },
];

export const randomeTitlePlaceholder = [
  "ویلا استخردار دوخوابه در ماسال",
  "کلبه جنگلی دوبلکس سه‌خوابه در ماسال",
  " ویلا لوکس استخردار چهارخوابه در رامسر",
  "سوییت یک‌خوابه ساحلی نزدیک دریا در کیش",
  "ویلا برای تولد با سالن بزرگ در شهریار",
  "باغ ویلا برای مهمانی فضای سرسبز در کردان",
  "کلبه چوبی مثلثی(سوئیسی) با جکوزی در جنگل های رشت",
];

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
