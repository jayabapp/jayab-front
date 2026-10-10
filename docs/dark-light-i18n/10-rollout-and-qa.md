# فیچر ۱۰ — برنامهٔ PR، دروازهٔ عرضه و QA

مبنا: `feat/new-app@c8e26fff` · این سند معیار تحویل پیاده‌سازی آینده است؛ بازنویسی فعلی صرفاً docs/starter است.

## ترتیب PRها

| مرحله | خروجی قابل review | وضعیت عرضه |
| --- | --- | --- |
| ۰ | ممیزی مسیرها، baseline screenshot/route rendering/performance و خطاهای فعلی | فارسی/روشن |
| ۱ | ۰۱: افزودن semantic tokens، حفظ primitive؛ بدون migration blanket | فارسی/روشن |
| ۲ | ۰۲: موتور و bootstrap با THEME_ENABLED=0 | فارسی/روشن |
| ۳ | رنگ و سطح گروه‌های صفحه، تدریجی؛ ۰۷ با تغییر طراحی جدا | فارسی/روشن |
| ۴ | ۰۳: next-intl با enabledLocales=fa؛ بدون cookies/headers locale | فارسی/روشن |
| ۵ | ۰۴: پیام‌ها، validation، toast و مهاجرت گروه‌های صفحه | فارسی/روشن |
| ۶ | ۰۸: logical direction؛ ۰۶ تایپوگرافی در PR جدا؛ ۰۹ display | فارسی/روشن |
| ۷ | ۰۵: کنترل‌ها، در محیط بررسی با همهٔ flags و locales فعال | عمومی هنوز gated |
| ۸ | دروازهٔ دارک پس از QA تمام مسیرها؛ سپس هر زبان پس از QA کامل | flags مستقل |
| فاز دوم | [۱۱: بازطراحی و جایگزینی برند](11-brand-redesign.md)، پس از پذیرش نهایی این فاز | تحویل مستقل Front/Panel/Back؛ در این فاز اجرا نشود |
| بعدی | adapter میلادی رزرو یا routing چندزبانه | ADR و پروژهٔ جدا |

ترتیب ۱ و ۴ الزاماً به هم وابسته نیست؛ تغییر یک فایل مشترک و providerها باید هماهنگ باشد. پرچم global صفحهٔ نیمه‌مهاجرت‌شده را محافظت نمی‌کند: کاربر از خانه به چت/مالک هم می‌رود، پس همهٔ مسیرهای قابل‌دسترسی در زبان/تم فعال باید آماده باشند. preview داخلی از build جدا با config همسان سرور/کلاینت استفاده کند.

## گروه‌های واقعی و سناریوها

1. chrome: SiteHeader، SiteFooter، MobileNav، AppShell، login modal، Toast، SplashScreen، not-found/error/loading.
2. خانه: app/(pages)/page.tsx و moduleهای Home؛ hero شفاف، header پس از scroll و home search.
3. جستجو: app/(pages)/rooms، PropertySearchFilters و کارت/اسکلتون؛ query filter و navigation رفت/برگشت.
4. تک‌آگهی: app/(pages)/rooms/[room_slug] و app/@modal/(.)rooms؛ PropertyDetails/Gallery/Booking/Contact؛ ورود مستقیم، intercepted و reload تغییر زبان.
5. پروفایل و رزرو: app/(profile)، GuestReservations و ReservationDetails؛ پیام‌های وضعیت و تاریخ/قیمت.
6. چت و پشتیبانی: app/(pages)/chat و moduleهای Chat/Support؛ متن mixed، draft، toast و modal.
7. CMS و عمومی: blog، faq، about/contact، terms، advisors و slug؛ UI ترجمه‌شده و محتوای API فارسی متمایز در گزارش.
8. مالک/مشاور: owner-property، فرم dirty، قیمت، calendar board و subscription؛ هیچ تبدیل payload جدیدی از locale نیاید.

فهرست دقیق مسیرها قبل از هر PR با rg --files به‌روز شود؛ نام این گروه‌ها glob اجرایی خودکار نیست.

## ماتریس QA

| محور | مقدار |
| --- | --- |
| تم resolved | light، dark |
| choice system | OS light و dark + تغییر زندهٔ OS |
| locale | fa، ar، en |
| viewport | ۳۲۰، ۳۹۰، ۷۶۸، ۱۴۴۰؛ breakpoint xl=1280 نیز برای header |
| session | مهمان، کاربر واردشده، نقش owner/advisor در مسیر مربوط |

برای صفحات اصلی حداقل ۲۴ screenshot از light/dark × سه زبان × چهار عرض؛ سناریوی system تست رفتار جداست و جای resolved dark/light را نمی‌گیرد. screenshot فارسی light قبل/بعد برای migration مکانیکی الزامی است. متن بلند، empty/error/loading، keyboard، zoom ۲۰۰٪ و reduced-motion پوشش داده شوند.

برای QA از localhost:3037 یا محیط تست معرفی‌شده با دادهٔ مصنوعی استفاده شود. دسترسی به محیط، OTP sandbox و حساب نقش‌ها **پیش‌فرض موجود نیست**؛ فایل memory خصوصی در این بسته پیش‌نیاز نباشد. ارسال رزرو/پرداخت/SMS با mock یا fixture تست شود؛ برای صحت نمایش نیازی به mutation واقعی نیست.

## چک‌ها

دستورهای **موجود** در repo از Front (در Windows می‌توان yarn.cmd استفاده کرد):

```powershell
yarn lint
yarn architecture:check
yarn architecture:cycles
yarn migration:guardrails
yarn build
```

در PR اجرایی `yarn i18n:check` و تست قرارداد تاریخ/formatter طبق فیچرهای ۰۴ و ۰۹ اضافه شوند؛ امروز این command هنوز وجود ندارد. check معماری فعلی روی app/qa-login خطای baseline دارد؛ این خطا جدا ثبت شود و با تغییر theme/i18n مخفی یا قاعده‌اش حذف نشود.

اسکن رنگ، متن و جهت فقط مسیرهای migrated را enforce کند؛ اسکن رنگ علاوه بر neutral و hex، رنگ خام Tailwind (red/green/emerald/amber و ...) را هم می‌گیرد. manifest پیشنهادی `scripts/ui-migration-manifest.json` شامل مسیر، محور تکمیل‌شده (color/i18n/direction)، استثنا و دلیل است؛ تکمیل رنگ به معنی تکمیل زبان نیست. rg برای یافتن کاندید است؛ AST برای import و متن JSX و ICU parser برای پیام استفاده شود. comment فارسی، regex ارقام، نام بومی زبان، رنگ عکس و left-1/2 استثنای معتبر ممکن‌اند. هیچ شرط کلی «تمام dark/neutral/hex/حروف عربی خالی» برقرار نشود.

بررسی starter جداست:

```powershell
node docs/dark-light-i18n/starter/verify-starter.mjs
node docs/dark-light-i18n/starter/audit-branch.mjs
```

این چک‌ها به معنی اجرای فیچر یا QA UI نیستند. package/runtime/generated فایل‌ها در بازنویسی فعلی تغییر ندارند.

## عملکرد، cache و سئو

baseline و after با production build، محیط، داده و شرایط شبکهٔ یکسان سنجیده شوند. برای خانه، فهرست و تک‌آگهی حداقل ۵ اجرای مرورگر و median LCP/CLS، حجم RSC پیام و فونت ثبت شود. برای median و p95 TTFB حداقل ۲۰ درخواست در هر وضعیت warm و cold با روش یکسان گرفته شود؛ نمونهٔ کم ادعای p95 قابل‌اتکا ندارد. هدف پیشنهادی: median TTFB/LCP بیش از ۱۰٪ بدتر نشود و CLS≤0.1 باشد؛ اگر baseline از قبل بدتر است، regression تازه ایجاد نشود و exception ثبت شود. صرف next build یا یک curl عملکرد را اثبات نمی‌کند.

- fa-only و چندزبانه خروجی ○/ƒ build مقایسه شود؛ هزینهٔ root cookies صریح گزارش شود.
- پاسخ localized با cookie en نباید از CDN برای fa برگردد؛ HTML و RSC هر دو بررسی شوند.
- canonical/redirect/SSO/basic auth و noindex محیط تست حفظ شوند؛ URL زبان نداریم، hreflang اضافه نمی‌کنیم، metadata/CMS فارسی محدودیت ثبت‌شده است.
- bootstrap تم قبل از paint، CSP production و splash بررسی شوند؛ flash را از filmstrip بسنجید.
- contrast متن/کنترل با جفت توکن واقعی و focus روی هر دو تم بررسی شود؛ ابزار بررسی حفظ شود.

## فلگ و rollback

| فلگ | پیش‌فرض | rollback واقعی |
| --- | --- | --- |
| NEXT_PUBLIC_THEME_ENABLED | 0 | rebuild روی 0؛ bootstrap/provider کوکی dark را نادیده می‌گیرند |
| NEXT_PUBLIC_THEME_CONTROL | 0 | فقط UI کنترل مخفی می‌شود |
| NEXT_PUBLIC_ENABLED_LOCALES | fa | rebuild روی fa؛ resolver کوکی ar/en را رد می‌کند |

public envها runtime kill switch نیستند؛ زمان build/deploy مجدد در runbook نوشته شود. revert هر دستهٔ migration به primitive و _STRINGS موجود متکی است؛ حذف آن‌ها فقط پس از پایان مهاجرت انجام شود. تست rollback با کوکی‌های قدیمی و browser cache لازم است.

## تعریف اتمام پیاده‌سازی

هر زبان/تم منتشرشده در تمام مسیرهای قابل‌دسترسی، including modal و error/loading، QA سبز دارد؛ ترجمه‌های UI، validation و پیام‌های فرانت کامل‌اند و استثناهای API/CMS ثبت شده‌اند. تست تاریخ و قیمت بدون تغییر domain پاس است، بودجهٔ performance و cache بررسی و rollback تمرین شده است. گزارش PR خطاهای baseline را از خطاهای تازه جدا می‌کند. بازنویسی این پوشه به‌تنهایی هیچ‌یک از این فیچرها را «پیاده‌شده» اعلام نمی‌کند.

## تحویل به فاز برند

پس از ثبت پذیرش بالا، commit مبنای Front، زبان‌های فعال، قرارداد واقعی locale/resolved theme، screenshotهای chrome/hero/splash و محدودیت‌های باز به [فیچر ۱۱](11-brand-redesign.md) تحویل داده شوند. آماده‌سازی سند برند به معنی اتمام فاز فعلی نیست. لازم نیست برای بستن این فاز لوگوها عوض شوند؛ فاز برند هم نباید به‌تنهایی زبان یا تم غیرفعال را فعال کند.

## وضعیت پیاده‌سازی (commit مبنا: بعد از `c117d04f`)

دروازهٔ عرضه به‌صورت ابزار و شواهد اجرا شد؛ **هیچ پرچم عمومی روشن نشد**: `NEXT_PUBLIC_THEME_ENABLED`، `NEXT_PUBLIC_ENABLED_LOCALES=fa` و `NEXT_PUBLIC_DISPLAY_CONTROLS_ENABLED` در `.env.example` بدون مقدار می‌مانند.

### ابزار تازه

- `yarn ui:check` (`scripts/check-ui-migration.mjs` + `scripts/ui-migration-manifest.json`): با پارسر TypeScript فقط متن JSX و رشته/قالب‌ها را می‌خواند، پس comment و مسیر import شمرده نمی‌شوند. محور `color` رنگ خام Tailwind (neutral، red، emerald، brand/danger/... با عدد، `white/black`)، hex و `rgb()` را می‌گیرد؛ محور `i18n` حروف فارسی/عربی را در متن و رشته‌ها. هر استثنا فایل، محور، `hits` دقیق، `kind` و دلیل دارد؛ فایل دارای استثنا اگر رنگ یا متن تازه بگیرد رد می‌شود و استثنای کهنه (مهاجرت‌شده) هم خطا است. محور direction همچنان با `yarn direction:check` اعمال می‌شود. تست منفی: افزودن `bg-red-600 text-neutral-500 #ff0000` به یک فایل پاک، چک را رد کرد.
- وضعیت manifest: ۱۱۴ استثنای **valid** (سطح تیرهٔ ثابت روی عکس، سفید روی پرشدگی ثابت status/brand، سایه، splash، پیام‌های route سرور، ابزار QA داخلی، متادیتا/JSON-LD فارسی، دادهٔ دامنه) و ۳۳ مورد **pending** (رنگ خام مهاجرت‌نشده مثل `bg-neutral-400` فوتر و `bg-emerald-500`، و سه DayPicker قدیمی با نام روزهای فارسی و `AdvisorCard` با `timeLeft`). `yarn ui:check -- --report` فهرست pending را چاپ می‌کند.

### نتیجهٔ چک‌ها

| چک | نتیجه |
| --- | --- |
| `tsc`، `yarn lint` | بدون خطای تازه؛ ۱۰ خطا/۴ هشدار baseline |
| `architecture:check` | همان خطای baseline روی `app/qa-login` (ثبت‌شده، پنهان یا حذف نشد) |
| `architecture:cycles`، `migration:guardrails`، `theme:check`، `i18n:check`، `i18n:namespaces`، `direction:check`، `ui:check`، `test:intl`، `verify-starter`، `audit-branch` | پاس |

### بیلد و cache

با `yarn build` (۱) fa-only پیش‌فرض و (۲) `fa,ar,en` + تم + کنترل‌ها مقایسه شد. fa-only: ۲۶ مسیر ایستا (○) و ۴۱ پویا؛ چندزبانه: **هر ۶۷ مسیر پویا (ƒ)**. این همان هزینهٔ cookie در root layout (فیچر ۰۳) است و باید قبل از روشن‌کردن زبان دوم پذیرفته شود. HTML ایستای fa-only برای همه یکسان است و کوکی را نمی‌خواند؛ در حالت چندزبانه HTML ایستا وجود ندارد، پس CDN نمی‌تواند نسخهٔ en را برای fa برگرداند. حجم `static` (JS+CSS): ۶٬۵۷۶٬۸۵۱ بایت در fa-only و ۶٬۵۷۶٬۶۲۰ چندزبانه (تفاوت ناچیز؛ پیام‌ها سمت سرور هستند). هدرهای واقعی `next start` (Cache-Control/Vary) و RSC اندازه‌گیری **نشد**.

### QA اجراشده (dev server، دادهٔ backend در دسترس نبود)

- ماتریس: light/dark × fa/ar/en × ۳۲۰/۳۹۰/۷۶۸/۱۴۴۰ روی `/terms`، `/faq`، `/route-hub` (۷۲ بارگذاری)؛ ۲۴ screenshot از `/terms`. هیچ overflow افقی، `dir`/`lang` درست (en=ltr، fa/ar=rtl)، خطای console فقط timeout بیرونی E-Namad و بدون hydration error.
- کنتراست متن (آستانه ۳:۱، ۶ صفحه، ۶ ترکیب تم/زبان، ۱۲۸۰px): بدون مورد. صفحه‌هایی با background-image از این جاروب کنار گذاشته می‌شوند.
- system: OS روشن→تیره→روشن بدون reload عوض شد؛ در بارگذاری تازه با OS تیره، `data-theme=dark` پیش از DOMContentLoaded بود. reduced-motion: انیمیشن بی‌پایان فعال نبود. focus با Tab: outline ۲px و رنگ `focus` دیده شد.
- rollback: با build پیش‌فرض (پرچم‌ها خاموش) و کوکی‌های قدیمی `jayab_theme=dark` و `jayab_locale=en` و OS تیره، صفحه روشن، `rtl` و `fa-IR` ماند و کنترل نمایش رندر نشد.
- **باگ یافت و رفع شد:** برآمدگی میانی نوار پایین موبایل (`footer_bump.svg`) سفید ثابت بود و در دارک مستطیل سفید می‌ساخت. اکنون SVG به‌صورت mask روی `bg-surface` رندر می‌شود؛ لایت بدون تغییر دیده شد و دارک با نوار یکی شد.

### Runbook عرضه و برگشت

پرچم‌ها زمان build خوانده می‌شوند، نه runtime: تغییر هر کدام یعنی build و deploy مجدد (حدود ۲٫۵ دقیقه build محلی هر کدام). ترتیب روشن‌کردن در محیط بررسی: (۱) `NEXT_PUBLIC_DISPLAY_CONTROLS_ENABLED=1` با `NEXT_PUBLIC_THEME_ENABLED=1` و `NEXT_PUBLIC_ENABLED_LOCALES=fa,ar,en`؛ (۲) QA کامل؛ (۳) عمومی: اول دارک (`THEME_ENABLED=1`)، سپس هر زبان جدا (`fa,en` پیش از `fa,ar,en`) فقط پس از بازبینی انسانی ترجمه‌ها. برگشت: همان پرچم را به مقدار پیش‌فرض (خالی/`fa`) برگردانید و rebuild کنید؛ کوکی‌های قدیمی نادیده گرفته می‌شوند (بالا تست شد). `THEME_CONTROL`/picker فقط UI را پنهان می‌کند. `_STRINGS` و primitiveهای رنگ تا پایان مهاجرت حذف نشوند.

### هنوز باز (نیازمند انسان یا محیط)

- QA با دادهٔ واقعی روی jayab.org: تک‌آگهی، فهرست، رزرو، پرداخت، چت، پروفایل، owner/advisor و نقش‌ها؛ screenshot فارسی روشن قبل/بعد برای کل صفحه‌های داده‌دار.
- بازبینی انسانی ترجمهٔ ar/en (و املای ماه‌های جلالی)؛ تا آن زمان `NEXT_PUBLIC_ENABLED_LOCALES=fa`.
- بودجهٔ عملکرد (median LCP/TTFB با ≥۵ اجرا، ≥۲۰ درخواست warm/cold)، filmstrip flash تم، CSP production و splash: اندازه‌گیری نشد.
- zoom ۲۰۰٪، متن بلند و حالت‌های empty/error روی صفحه‌های داده‌دار.
- ۳۳ مورد pending در manifest، footer، `maximumScale`/`touch-action`، تقویم‌های قدیمی جلالی.
- پذیرش نهایی این فاز و تحویل به [فیچر ۱۱](11-brand-redesign.md) فقط پس از بستن موارد بالا.
