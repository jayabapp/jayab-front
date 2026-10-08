# ممیزی تطبیق با feat/new-app

تاریخ: ۲۰۲۶-۱۰-۰۸ · repository: Front · branch: feat/new-app · HEAD: c8e26fff (feat: update property details and amenities).

ابتدای بررسی Front روی main بود و فقط docs/ untracked داشت. branch با نام دقیق new-app وجود نداشت؛ branch موجود **feat/new-app** انتخاب شد و git آن را همگام با origin/feat/new-app گزارش داد. fetch انجام نشده است؛ این گزارش وضعیت checkout محلی است. Back/Panel تغییر نکردند.

## نتیجهٔ بررسی

موضوع فیچرها لازم و قابل پیاده‌سازی است، اما نسخهٔ قبلی برای اجرای مستقیم روی این برنچ آماده نبود. مشکل اصلی ارجاع به ساختار قدیمی، تناقض تصمیم‌ها و حفاظت ناکافی از domain/cache بود. اسناد و starterها در همین پوشه بازنویسی شدند؛ runtime اپ و dependencies تغییر نکرده‌اند.

| یافتهٔ قبلی | شاهد این برنچ | اصلاح |
| --- | --- | --- |
| theme/colors و PropertyDetails وجود ندارند | theme/colors.ts و components/modules/PropertyDetails موجودند | palette و module موجود پایهٔ طرح شدند |
| primary/btnColor پالت اصلی است | tailwind.config.ts پالت brand/neutral/status را import می‌کند | primitive حفظ، semantic اضافه می‌شود |
| ۲۵۸ dark variant و isDark موجود است | اسکن dark variant صفر؛ isDark/theme-mode در store/UI موجود نیست | migration حذف state خیالی کنار گذاشته شد |
| features در content نیست | tailwind.config.ts شامل features و utils است | ادعای missing content حذف شد |
| headers/shared/properties قدیمی محل اجرا هستند | elements/layouts/modules/templates، feature hooks و types متمرکز | مالکیت و مسیرها بازنویسی شد |
| پراکسی backend پیدا نشده | app/api/backend/[...path]/route.ts و utils/proxyAllowlist.ts موجودند | زنجیرهٔ apiCall و allowlist صریح شد |
| تم system زیرساخت را فوراً فعال می‌کند | صفحات سفید ثابت فراوان دارند | فلگ موتور جدا از کنترل و light در حالت خاموش |
| storage event با کوکی sync می‌کند | نوشتن cookie رویداد storage ندارد | BroadcastChannel و fallback focus، بدون rebroadcast loop |
| fallback فارسی با namespace.key | starter فقط key خام می‌داد | fallback ادعایی حذف و parity به gate تبدیل شد |
| اولین Accept-Language ذخیره می‌شود | request config فقط cookie می‌خواند و setter تنها writer بود | default fa و انتخاب صریح، بدون auto-detection ناقص |
| x-locale راه حفظ static است | headers هم Dynamic API است | cost cookies/headers و fa-only short-circuit صریح شد |
| ml→ms و left→start | baseline RTL چنین تبدیلی را برعکس می‌کند | تبدیل بر اساس نقش؛ ml→me و left→end در حالت متناظر |
| هر section تک‌آگهی کارت شود | ListingSection فعلی divider-based است | حفظ baseline، card opt-in در PR طراحی |
| فقط یک DatePicker و compact price | چند calendar؛ formatCalendarCellPrice قرارداد تومان/۱۰۰۰ دارد | مصرف‌ها، payload و فرمت سلول جدا مستند شد |
| تغییر locale یعنی تقویم میلادی | stay-range و reservation-dates domain حساس دارند | تقویم مستقل از زبان؛ میلادی milestone جدا |
| تست/چک ساخته‌شده حذف شود | regression تاریخ/contrast در آینده محتمل است | چک معنادار حفظ‌شونده، نه اسکریپت یک‌بارمصرف |

## شمارش قابل‌بازتولید

از Front اجرا شد: `node docs/dark-light-i18n/starter/audit-branch.mjs`.

محدوده فقط app/components/features و پسوند ts/tsx است؛ helpers/utils/styles/generated در این اعداد نیستند. تعداد فایل source: **۹۴۶**؛ TSX: **۵۸۴**. patternها داخل script ثبت‌اند؛ occurrence با تعداد فایل و تعداد task متفاوت است.

| الگو | occurrence | فایل |
| --- | --- | --- |
| bg-white | ۱۸۲ | ۱۳۲ |
| dark variant | ۰ | ۰ |
| legacy primary/btnColor class | ۲ | ۲ |
| import از LocalStrings | ۲۶۰ | ۲۶۰ |
| import از moment-jalaali | ۵۳ | ۵۳ |
| رنگ خام Tailwind (red/green/amber/...) | ۴۷ | ۲۷ |
| text-xxs (۱۰px) | ۴۰ | ۲۹ |
| حروف Arabic-script؛ کاندید، شامل comment و regex | ۳۵۰۹ | ۹۵ |
| کلاس جهت فیزیکی مطابق pattern script | ۳۱۹ | ۱۲۰ |

اعداد فایل‌ها هم‌پوشانی دارند و نباید برای تخمین حجم کار با هم جمع شوند. در هر PR اجرایی audit دوباره اجرا شود؛ شمارش قدیمی معیار اتمام نیست.

## شواهد کد و قراردادهای مهم

- app/layout.tsx: RootLayout، metadata فارسی، html ثابت، font محلی و composition جدید.
- app/layout-provider.client.tsx: QueryClientProvider موجود؛ provider دوم اضافه نشود.
- components/modules/SiteHeader/SiteHeader.client.tsx: isLight مربوط به hero است؛ theme preference نیست.
- components/modules/AppShell/parts/AppOverlays.client.tsx: Toaster؛ components/elements/Toast/Toast.tsx: markup جداگانهٔ toast.custom.
- theme/colors.ts و components/elements/Map/map-colors.ts: SDK با literal color؛ تبدیل palette به variable برای همهٔ مصرف‌ها امن نیست.
- features/properties/api/property.keys.ts: کارخانهٔ query key؛ locale-sensitive شدن API باید key/prefetch یکسان داشته باشد.
- lib/api/generated-client.ts: adapter generated به apiCall؛ فایل‌های generated دستی ویرایش نشوند.
- features/reservations/lib/stay-range.ts: MAX_STAY_NIGHTS=15 و API_DATE=YYYY-MM-DD.
- features/reservations/mappers/reservation-dates.ts: parse strict جلالی به API و loadPersian در سطح module؛ locale instance باید از global جدا شود.
- helpers/formatCalendarCellPrice.ts: Math.round(value/1000)، بدون پسوند؛ با formatCompactToman جایگزین نشود.
- architecture و eslint.config.mjs: templates سروری؛ elements مستقل از domain؛ moduleها high-level hooks و types متمرکز دارند.

project-overview.md و coding-standard.md محلی پیش از تغییر خوانده شدند. بخش‌هایی از نقشهٔ آن‌ها وضعیت main را توصیف می‌کند؛ الزامات امنیتی/سبک حفظ و پیشنهادها با guardrailهای اجرایی برنچ تطبیق داده شد. این فایل‌های محلی تغییر یا stage نشدند.

## بررسی‌های انجام‌شده روی checkout

| بررسی | نتیجه |
| --- | --- |
| yarn.cmd build | موفق؛ compilation و TypeScript و generation کامل |
| yarn.cmd lint | baseline شکست: ۱۱ error و ۲ warning در فایل‌های runtime دست‌نخورده |
| node scripts/check-layer-contracts.mjs | baseline شکست: app/qa-login بیرون route groupهای مجاز |
| node scripts/check-import-cycles.mjs | موفق؛ ۷۴۱ فایل |
| lint دو اسکریپت جدید با ESLint پروژه | موفق؛ بدون error یا warning |
| node scripts/check-migration-guardrails.mjs | موفق؛ ۲ فایل source جدید بررسی شد |
| node docs/dark-light-i18n/starter/verify-starter.mjs | موفق؛ ۷۶ کلید × سه زبان، ۴۲ جفت کنتراست، syntax سه بلوک TS، resolve فلگ/کوکی و ۲۲ لینک محلی |

خطاهای lint مربوط به unused در app/api/llms/route.ts، helpers/MinuteToHour.ts، helpers/Observer/index.tsx، helpers/queryBuilder.ts و store/index.tsx و useMemo در helpers/queryGet.ts هستند. این موارد در محدودهٔ بازنویسی مشخصات theme/i18n رفع نشده‌اند و پیش‌نیاز baseline سالم برای PR اجرایی ثبت شدند. اجرای yarn در PowerShell به policy اسکریپت برخورد کرد؛ yarn.cmd بدون تغییر policy اجرا شد.

خروجی build مبنا: **خانه، rooms و rooms/[room_slug] dynamic** هستند؛ about-us، auth، chat index، contact-us، faq، تعدادی profile و terms **static با revalidate ده دقیقه** هستند. بنابراین اضافه‌کردن cookies locale در root می‌تواند صفحات static دیگر را dynamic کند، حتی اگر مسیرهای اصلی قبلاً dynamic باشند. next-intl هنوز نصب نیست؛ این build سازگاری runtime آیندهٔ آن را تأیید نمی‌کند.

verify-starter تست UI، بررسی type integration کتابخانهٔ نصب‌نشده یا parser کامل grammar ICU نیست. بازبینی انسانی عربی، عملکرد production پس از پیاده‌سازی، CSP واقعی deploy و قابلیت locale بک‌اند هنوز خارج از شواهد این بازنویسی‌اند.
