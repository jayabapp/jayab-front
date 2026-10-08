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

اسکن رنگ، متن و جهت فقط مسیرهای migrated را enforce کند. manifest پیشنهادی `scripts/ui-migration-manifest.json` شامل مسیر، محور تکمیل‌شده (color/i18n/direction)، استثنا و دلیل است؛ تکمیل رنگ به معنی تکمیل زبان نیست. rg برای یافتن کاندید است؛ AST برای import و متن JSX و ICU parser برای پیام استفاده شود. comment فارسی، regex ارقام، نام بومی زبان، رنگ عکس و left-1/2 استثنای معتبر ممکن‌اند. هیچ شرط کلی «تمام dark/neutral/hex/حروف عربی خالی» برقرار نشود.

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
