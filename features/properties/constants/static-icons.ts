import type { StaticIconSet } from "@/types/components/elements/static-icon";
import type { StaticIconRef } from "@/types/components/elements/static-icon";
import type { IconName } from "@/types/components/elements/icon";

const at = (set: StaticIconSet, n: string): StaticIconRef => ({ set, n });

type OptionIconRule = {
  match: RegExp;
  icon: StaticIconRef;
  groups?: readonly string[];
};

export const OPTION_ICON_RULES: readonly OptionIconRule[] = [
  // Pool types
  {
    groups: ["pool_type"],
    match: /سرپوشیده|داخل واحد|داخل ساختمان|ایندور|داخلی/,
    icon: at("pool-type", "01"),
  },
  { groups: ["pool_type"], match: /کودک|بچه/, icon: at("pool-type", "05") },
  {
    groups: ["pool_type"],
    match: /آب گرم|گرم|جکوزی/,
    icon: at("pool-type", "03"),
  },
  {
    groups: ["pool_type"],
    match: /رو ?باز|روباز/,
    icon: at("pool-type", "02"),
  },
  { match: /استخر/, icon: at("pool-type", "04") },

  // Kitchen
  {
    groups: ["kitchen"],
    match: /یخچال|فریزر/,
    icon: at("kitchen-amenities", "01"),
  },
  { match: /لباس ?شویی/, icon: at("kitchen-amenities", "02") },
  { match: /مایکروفر|مایکروویو/, icon: at("kitchen-amenities", "03") },
  {
    groups: ["kitchen"],
    match: /(^| )فر( |$)|اجاق|گاز/,
    icon: at("kitchen-amenities", "04"),
  },
  { match: /ظرف ?شویی/, icon: at("kitchen-amenities", "05") },
  {
    groups: ["kitchen"],
    match: /بشقاب|قاشق|چنگال|سرویس غذا ?خوری|ظروف/,
    icon: at("kitchen-amenities", "06"),
  },
  {
    groups: ["kitchen"],
    match: /قابلمه|لوازم پخت|لوازم آشپزی|ظروف پخت|تابه/,
    icon: at("kitchen-amenities", "07"),
  },
  {
    groups: ["kitchen"],
    match: /چای ?ساز|کتری برقی|قهوه ?ساز|جوش ?آور/,
    icon: at("kitchen-amenities", "08"),
  },
  {
    groups: ["kitchen"],
    match: /کتری|سماور|چای ?جوش|قوری/,
    icon: at("kitchen-amenities", "09"),
  },
  {
    groups: ["kitchen"],
    match: /ناهار ?خوری|غذا ?خوری|میز/,
    icon: at("kitchen-amenities", "10"),
  },
  { match: /یخچال|فریزر/, icon: at("kitchen-amenities", "01") },

  // Heating and cooling
  {
    match: /شوفاژ|رادیاتور|گرمایش مرکزی|سیستم گرمایشی/,
    icon: at("heating-cooling", "01"),
  },
  { match: /اسپیلت|اسپلیت|سیستم سرمایشی/, icon: at("heating-cooling", "02") },
  { match: /کولر گازی/, icon: at("heating-cooling", "03") },
  {
    match: /داکت|چیلر|فن ?کوئل|هواساز|تهویه/,
    icon: at("heating-cooling", "04"),
  },
  { match: /شومینه/, icon: at("heating-cooling", "05") },
  {
    match: /کف گرم|گرمایش (از )?کف|گرمایش کف/,
    icon: at("heating-cooling", "06"),
  },
  { match: /بخاری برقی|هیتر برقی|پنل برقی/, icon: at("heating-cooling", "12") },
  { match: /هیتر|گرمکن/, icon: at("heating-cooling", "07") },
  { match: /پکیج|آب ?گرمکن|موتورخانه/, icon: at("heating-cooling", "08") },
  { match: /بخاری/, icon: at("heating-cooling", "09") },
  { match: /آتش ?دان|کوره|هیزم/, icon: at("heating-cooling", "10") },
  { match: /کولر آبی|کولر/, icon: at("heating-cooling", "11") },
  { match: /پنکه|بادبزن|(^| )فن( |$)/, icon: at("heating-cooling", "13") },

  // Welfare
  { match: /وای ?فای|اینترنت|wifi/i, icon: at("amenities", "01") },
  { match: /تلویزیون|ماهواره/, icon: at("amenities", "02") },
  { match: /باربیکیو|کباب|منقل|bbq/i, icon: at("amenities", "03") },
  { match: /آلاچیق|الاچیق|کپر/, icon: at("amenities", "04") },
  { match: /پارکینگ/, icon: at("amenities", "05") },
  { match: /آسانسور/, icon: at("amenities", "06") },
  { match: /تراس|بالکن|ایوان/, icon: at("amenities", "07") },
  { match: /آتش ?گاه|محل آتش|آتش/, icon: at("amenities", "08") },
  {
    match: /میز و صندلی|ست نشیمن|نشیمن (فضای باز|حیاط)|سایه ?بان/,
    icon: at("amenities", "09"),
  },
  {
    match: /(^| )تاب( |$)|سرسره|زمین بازی|پارک کودک|وسایل بازی/,
    icon: at("amenities", "10"),
  },
  { match: /کتابخانه|قفسه/, icon: at("amenities", "11") },
  {
    match: /تخت آفتاب|آفتاب ?گیر|شزلونگ|لانج|ساحل خصوصی|صندلی ساحلی/,
    icon: at("amenities", "12"),
  },
  { match: /دوربین|مداربسته/, icon: at("amenities", "13") },
  {
    match: /کنسول|پلی ?استیشن|ایکس ?باکس|دی ?وی ?دی/,
    icon: at("amenities", "14"),
  },
  { match: /مجتمع|شهرک/, icon: at("amenities", "15") },
  {
    match: /سیستم صوتی|اسپیکر|بلندگو|ضبط|ساندبار|سینمای خانگی/,
    icon: at("amenities", "16"),
  },
  { match: /حوله|ملحفه|سرویس خواب|پتو|رختخواب/, icon: at("amenities", "17") },
  { match: /پروژکتور|دیتا ?شو/, icon: at("amenities", "18") },
  { match: /(^| )اتو( |$)/, icon: at("amenities", "19") },
  { match: /سشوار/, icon: at("amenities", "20") },
];

/** The glyph an option group falls back on when no rule matches its title. */
export const GROUP_FALLBACK_ICON: Record<string, StaticIconRef | undefined> = {
  pool_type: at("pool-type", "04"),
};

/** Listing-page facts and costs: the existing icon names, drawn from the overview set. */
export const OVERVIEW_ICONS: Partial<Record<IconName, StaticIconRef>> = {
  home: at("property-overview", "01"),
  users: at("property-overview", "02"),
  bed: at("property-overview", "03"),
  ruler: at("property-overview", "04"),
  toilet: at("property-overview", "05"),
  bath: at("property-overview", "08"),
  "user-plus": at("property-overview", "09"),
  broom: at("property-overview", "10"),
  clock: at("property-overview", "11"),
};

/** Home "quick search" tiles, by landing slug. */
export const LANDING_CARD_ICONS: Record<string, StaticIconRef> = {
  feast: at("card-icons", "01"),
  pool: at("card-icons", "02"),
  forest: at("card-icons", "03"),
  coastal: at("card-icons", "04"),
  "summer-house": at("card-icons", "05"),
  "animal-lover": at("card-icons", "06"),
  ecotourism: at("card-icons", "11"),
  cottage: at("card-icons", "12"),
};

/** Home "property type" tiles by option id, which is the same in every language. */
export const PROPERTY_TYPE_CARD_ICONS_BY_ID: Record<number, StaticIconRef> = {
  7: at("card-icons", "10"),
  8: at("card-icons", "09"),
  9: at("card-icons", "14"),
  27: at("card-icons", "17"),
  102: at("card-icons", "12"),
  103: at("card-icons", "16"),
  106: at("card-icons", "11"),
  108: at("card-icons", "18"),
};

type TitleIconRule = { match: RegExp; icon: StaticIconRef };

/** The same tiles by title, for ids that differ between environments (any language). */
export const PROPERTY_TYPE_CARD_ICONS: readonly TitleIconRule[] = [
  {
    match: /باغ ?تالار|تالار|event garden|حديقة للمناسبات/i,
    icon: at("card-icons", "18"),
  },
  { match: /بوتیک|boutique|بوتيك/i, icon: at("card-icons", "16") },
  { match: /حیاط ?دار|courtyard|بفناء/i, icon: at("card-icons", "17") },
  {
    match: /بوم ?گرد|eco ?lodge|نزل بيئي|نُزل بيئي/i,
    icon: at("card-icons", "11"),
  },
  { match: /کلبه|cabin|كوخ/i, icon: at("card-icons", "12") },
  { match: /سوئیت|سوییت|suite|جناح/i, icon: at("card-icons", "09") },
  { match: /آپارتمان|apartment|شقة/i, icon: at("card-icons", "14") },
  { match: /ویلا|villa|فيلا/i, icon: at("card-icons", "10") },
];
