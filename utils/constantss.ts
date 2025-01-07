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
];

export const mobileFooterWhiteList = ["/"];

export const createPropertySteps = [
  { title: "اطلاعات عمومی", id: 1 },
  { title: "موقعیت مکانی", id: 2 },
  { title: "تصاویر", id: 3 },
  { title: "اطلاعات محیطی", id: 4 },
  { title: "اتاق خواب", id: 5 },
  { title: "امکانات", id: 6 },
  { title: "ظرفیت", id: 7 },
  { title: "دستیار", id: 8 },
  { title: "قوانین", id: 9 },
];

export const SORT_TYPES = [
  { id: "new", title: "جدیدترین" },
  { id: "cheapest", title: "ارزان ترین" },
  { id: "expensive", title: "گران ترین" },
  { id: "best_sellers", title: "پرفروش ترین" },
];

export const allRoutes: { [key: string]: string } = {
  questions: "پرسش ها",
  blog: "بلاگ",
  blogs: "بلاگ",
  orders: "سفارشات",
  lawyers: "وکیل ها",
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
  { id: 15, title: "آگهی های من", route: "/profile/orders", imgSrc: "/assets/icons/header/header_my_adds.svg" },
  { id: 21, title: "پیام های من", route: "/profile/edit", imgSrc: "/assets/icons/header/header_my_messages.svg" },
  { id: 421, title: "پرداخت های من", route: "/profile/edit", imgSrc: "/assets/icons/header/header_my_turnovers.svg" },
  { id: 123, title: "آگهی های ذخیره شده", route: "/profile/edit", imgSrc: "/assets/icons/header/header_my_saves.svg" },
  { id: 23, title: "دعوت از دوستان", route: "/profile/edit", imgSrc: "/assets/icons/header/header_share.svg" },
  { id: 253, title: "پشتیبانی", route: "/profile/edit", imgSrc: "/assets/icons/header/header_support.svg" },
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
