# فیچر ۰۵ — کنترل‌های تم و زبان در SiteHeader موجود

مبنا: `feat/new-app@c8e26fff` · وابسته به ۰۲ و ۰۳ · نمایش عمومی پس از دروازه‌های ۱۰.

## وضعیت پیاده‌سازی

اصلاح مصوب ۲۰۲۶-۱۰-۱۱: دکمهٔ عمومی تنظیمات و دو select حذف شدند. `DisplayPreferences` اکنون دو کنترل مستقل دارد: `LanguagePicker.client.tsx` با آیکون کرهٔ زمین و فهرست مستقیم نام بومی زبان‌ها، و `ThemeSwitcher.client.tsx` با انتخاب خورشید/سیستم/ماه. دسکتاپ انتخاب تم مستقیماً در هدر است؛ موبایل برای حفظ فضا یک آیکون وضعیت جاری و پنل سه گزینهٔ آیکون‌دار با برچسب دارد. تم از radio بومی با نام گروه یکتا استفاده می‌کند؛ مقدار choice نمایش داده می‌شود، نه resolved. زبان با دکمهٔ مستقیم، lang/dir مستقل و نشان انتخاب فعلی مشخص است.

فلگ‌های قبلی حفظ شدند: `NEXT_PUBLIC_DISPLAY_CONTROLS_ENABLED` برای کنترل‌ها، `NEXT_PUBLIC_THEME_ENABLED` برای موتور و `NEXT_PUBLIC_ENABLED_LOCALES` برای زبان‌های قابل انتخاب. اگر هیچ کنترلی فعال نباشد خروجی null است. provider یا writer/listener تم جدیدی ایجاد نشد. Popoverهای موجود Headless UI مدیریت focus و Escape را انجام می‌دهند.

جانمایی: داخل `HeaderSessionBadge` برای دسکتاپ/موبایل خانه، کنار جست‌وجوی موبایل و کنار action هدر داخلی. هدر داخلی grid با slot برگشت، عنوان قابل کوتاه‌شدن و actionها دارد؛ عنوان بلند کنترل‌ها را از viewport خارج نکند. نسبت‌های ثابت قبلی دسکتاپ با فضای انعطاف‌پذیر جستجو و منوی shrink-0 جایگزین شدند. route جدیدی اضافه نشد.

قفل زبان: روی مسیرهای `/auth*`، `/chat/<id>`، `/profile/edit`، `/profile/support/new-ticket` و `/profile/owner/properties/<id>/edit*` دکمه‌های گزینهٔ زبان disabled هستند و دلیل ترجمه‌شده (`language.switchBlocked`) با `aria-describedby` نمایش داده می‌شود؛ این قفل مسیرمحور و محتاطانه است. ردیابی dirty هر فرم و پرداخت/رزرو در حال ارسال هنوز نیست (به registryای نیاز دارد که فرم‌ها گزارش دهند).

قرارداد موقعیت: SiteHeader و MobileNav جهت چیدمان ثابت rtl دارند تا جای اجزا در fa/ar/en مانند فارسی بماند. متن‌ها، ورودی جستجو و محتوای پنل جهت locale می‌گیرند. html انگلیسی همچنان ltr است؛ کل صفحه RTL نشده است. فلش برگشت هدر در سمت ثابت باقی می‌ماند و با زبان نمی‌چرخد. نوار پایین slotهای هم‌اندازه دارد تا متن بلند جای آیتم‌ها را تغییر ندهد.

بررسی اصلاح: ایراد نسخهٔ select و ترتیب انگلیسی روی jayab.org مشاهده شد. تست تعاملی تغییرات در پیش‌نمایش ایزولهٔ بدون شبکه با کامپوننت‌های واقعی هدر، next-intl، Headless UI و موتور تم انجام شد؛ دادهٔ نشست/جستجو mock و کوکی آزمایشی در حافظه بود. انتخاب تم، arrow key/Space، Escape و بازگشت focus، نام زبان‌ها و محدودیت مسیر ورود بررسی شدند. این پیش‌نمایش جای تست یکپارچهٔ نسخهٔ منتشرشده روی دامنه را نمی‌گیرد؛ screen reader واقعی، هدر modal و فلوهای متصل به داده باید پس از انتشار در محیط تست بررسی شوند. خطاهای lint/معماری پایه جدا از regression گزارش شوند.

## محل واقعی تغییر

هدر این برنچ یک فایل قدیمی ۵۴۰خطی نیست؛ در `components/modules/SiteHeader` به SiteHeader.client، HeaderDesktopNav، HeaderMobileBar، HeaderSessionBadge و HeaderProfileMenu شکسته شده است. `types/components/modules/site-header.ts` مالک props است.

در SiteHeader، `isLight = isHome && topHeaderVisible` به معنی **متن روشن روی hero** است؛ تم light نیست. نام ترجیحی برای واضح‌شدن در PR جدا `overHero` است؛ تم global از useTheme خوانده شود و با این حالت اشتباه نشود.

## ساختار پیشنهادی

کنترل ترجیح اپ module باشد، چون به state تم و locale متصل است: `components/modules/DisplayPreferences/DisplayPreferences.client.tsx` با index.ts عمومی و parts خصوصی ThemeSwitcher/LanguagePicker. typeهای UI در `types/components/modules/display-preferences.ts`. SiteHeader فقط entry عمومی module را مصرف کند. Icon پایه صرفاً نام/اندازه دریافت می‌کند و feature/store import نمی‌کند.

تم با radio بومی و ظاهر آیکونی انتخاب شود؛ arrow key و Space رفتار بومی داشته باشند. زبان با یک کلیک روی نام انتخاب شود؛ نقش ARIA منو یا listbox بدون رفتار کامل آن‌ها اضافه نشود. الگوی بصری از [Geist Theme Switcher](https://vercel.com/geist/theme-switcher) و قرارداد کیبورد از [WAI Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) الهام می‌گیرد؛ کتابخانهٔ تم پروژه تغییر نمی‌کند.

| کنترل | گزینه‌ها | قرارداد |
| --- | --- | --- |
| تم | روشن، تیره، سیستم | انتخاب واقعی choice را نشان دهد؛ system با resolved فعلی اشتباه نشود |
| زبان | فقط enabledLocales | نام بومی فارسی / العربية / English؛ انتخاب فعلی مشخص |
| ظرف | variant عادی / روی hero | کنتراست هر دو تم؛ رنگ متن hero مستقل از choice تم |

## جانمایی

- دسکتاپ: داخل HeaderDesktopNav کنار session/profile، با shrink-0 و بدون افزودن فلو ورود جدید. فضای انعطاف‌پذیر search و عرض متن انگلیسی بررسی شوند؛ کنترل‌ها نباید search را بیرون viewport ببرند.
- موبایل خانه: آیکون زبان و آیکون وضعیت تم با پنل انتخاب آیکونی؛ حالت homeSearchInView و جایگزینی search هنگام scroll پوشش داده شود.
- موبایل جستجو: HeaderMobileBar برای showsFullSearch زود return می‌کند؛ کنترل در این شاخه نیز قابل‌دسترسی باشد و به input عرض منفی ندهد.
- موبایل داخلی: برگشت، عنوان route و action فعلی حفظ شوند؛ preferences در پنل/منوی مناسب جای بگیرد. اگر header طبق blacklist پنهان است، تنظیمات از ورودی دیگر موجود قابل‌دسترسی باشد؛ برای این کار route عمومی جدید در root app ساخته نشود.
- هدر modal با variant=modal و شناسهٔ جدا وجود دارد؛ idهای کنترل یکتا باشند و دو header باعث دو writer یا listener مستقل برای preference نشوند.

## رفتار و دسترس‌پذیری

حداقل ناحیهٔ تعاملی ۴۴×۴۴؛ label قابل‌خواندن، focus-visible قابل دیدن، Tab طبیعی، Escape و بازگشت focus در پنل سفارشی. گزینه‌های بومی با lang مستقل مشخص شوند. پرچم کشور جای زبان را نگیرد. پنل portal جهت locale را ارث ببرد، روی modal پشت overlay نرود و از viewport خارج نشود.

تم فقط وقتی موتور و فلگ کنترل فعال‌اند نمایش داده شود. locale فقط وقتی بیش از یک زبان فعال است نمایش داده شود. هیچ کنترل disabled بی‌توضیح یا گزینهٔ منتشرنشده وجود نداشته باشد. هنگام آماده‌نبودن snapshot تم، اندازهٔ جای کنترل ثابت باشد تا CLS ایجاد نشود.

زبان مطابق فیچر ۰۳ reload کامل دارد؛ در OTP، پرداخت/رزرو pending و فرم dirty غیرفعال با دلیل کوتاه ترجمه‌شده است. فقط تغییر زبان ممکن است navigation ایجاد کند؛ تغییر تم state فرم و modal را حفظ می‌کند.

## پذیرش و برگشت

- هر سه شاخهٔ موبایل، دسکتاپ، hero شفاف، header پس از scroll و modal بررسی شوند؛ در ۳۲۰px overflow افقی نباشد.
- انتخاب system، light و dark persisted است؛ انتخاب زبان نامعتبر/غیرفعال در handler هم رد می‌شود.
- keyboard و screen reader label/انتخاب را درست می‌خوانند؛ drawer/panel با Escape بسته و focus بازمی‌گردد.
- session badge، اعلان، chat count، CTA ثبت آگهی و navigation قبلی همان رفتار را دارند.
- چک‌های فیچر ۱۰ اجرا شود. برای rollback، فلگ کنترل مخفی می‌کند؛ خاموش‌کردن **موتور** تم با فلگ جدا و rebuild انجام می‌شود.
