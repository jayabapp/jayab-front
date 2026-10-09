# فیچر ۰۵ — کنترل‌های تم و زبان در SiteHeader موجود

مبنا: `feat/new-app@c8e26fff` · وابسته به ۰۲ و ۰۳ · نمایش عمومی پس از دروازه‌های ۱۰.

## وضعیت پیاده‌سازی

کنترل پیاده شد پشت فلگ build-time جدید `NEXT_PUBLIC_DISPLAY_CONTROLS_ENABLED=1` (پیش‌فرض خاموش؛ در `.env.example` مستند است). ماژول `components/modules/DisplayPreferences` (index، `config.ts`، parts: PreferenceSelect/ThemeSelect/LocaleSelect، types در `types/components/modules/display-preferences.ts`) یک دکمهٔ ۴۴×۴۴ با Popover از Headless UI و دو `<select>` بومی با label می‌دهد. تم فقط با `NEXT_PUBLIC_THEME_ENABLED=1` و زبان فقط با بیش از یک زبان در `NEXT_PUBLIC_ENABLED_LOCALES` دیده می‌شود؛ اگر هیچ‌کدام نباشد کامپوننت `null` برمی‌گرداند. select تم مقدار choice را نشان می‌دهد (نه resolved)؛ select زبان نام بومی با `lang` مستقل دارد و انتخاب نامعتبر در `useLocaleSwitch` رد می‌شود. idها با `useId` یکتا هستند و writer/listener تم همچنان فقط یکی (provider) است.

جانمایی: داخل `HeaderSessionBadge` (دسکتاپ کنار تماس/اعلان و موبایل خانه)، کنار فیلد جستجو در شاخهٔ `showsFullSearch` موبایل، و در نوار موبایل داخلی کنار action فعلی (دکمهٔ برگشت و slot در این حالت عرض متقارن می‌گیرند تا عنوان وسط بماند). روی هیچ route جدید اضافه نشد.

قفل زبان: روی مسیرهای `/auth*`، `/chat/<id>`، `/profile/edit`، `/profile/support/new-ticket` و `/profile/owner/properties/<id>/edit*` select زبان disabled است و دلیل ترجمه‌شده (`language.switchBlocked`) با `aria-describedby` نمایش داده می‌شود؛ این قفل مسیرمحور و محتاطانه است. ردیابی dirty هر فرم و پرداخت/رزرو در حال ارسال هنوز نیست (به registryای نیاز دارد که فرم‌ها گزارش دهند).

آزمون روی build production با هر سه فلگ روشن: دسکتاپ ۱۳۶۰px — دکمه ۴۴×۴۴، انتخاب dark کوکی `jayab_theme` و `data-theme` و meta theme-color را می‌گذارد؛ انتخاب en کوکی `jayab_locale` می‌گذارد، همان URL را reload می‌کند و `lang=en dir=ltr` می‌شود و تم باقی می‌ماند. موبایل ۳۲۰px روی `/`، `/rooms`، `/about-us`، `/faq` بدون overflow افقی؛ پنل داخل viewport می‌ماند، Escape می‌بندد و focus به دکمه برمی‌گردد. با فلگ خاموش هیچ دکمه‌ای در HTML نیست. هنوز آزمایش‌نشده: header روی hero شفاف با تم تیره، هدر modal (variant=modal) در مرورگر، screen reader واقعی، روی هم‌افتادن با عنوان‌های بلند در موبایل داخلی (عنوان کوتاه‌ها بدون مشکل، «About us» در ۳۲۰px دو خطی شد)، و جهت LTR هدر که به فیچر ۰۸ می‌رسد.

## محل واقعی تغییر

هدر این برنچ یک فایل قدیمی ۵۴۰خطی نیست؛ در `components/modules/SiteHeader` به SiteHeader.client، HeaderDesktopNav، HeaderMobileBar، HeaderSessionBadge و HeaderProfileMenu شکسته شده است. `types/components/modules/site-header.ts` مالک props است.

در SiteHeader، `isLight = isHome && topHeaderVisible` به معنی **متن روشن روی hero** است؛ تم light نیست. نام ترجیحی برای واضح‌شدن در PR جدا `overHero` است؛ تم global از useTheme خوانده شود و با این حالت اشتباه نشود.

## ساختار پیشنهادی

کنترل ترجیح اپ module باشد، چون به state تم و locale متصل است: `components/modules/DisplayPreferences/DisplayPreferences.client.tsx` با index.ts عمومی و parts خصوصی ThemeSelect/LocaleSelect. typeهای UI در `types/components/modules/display-preferences.ts`. SiteHeader فقط entry عمومی module را مصرف کند. اگر select پایه لازم شد، element آن صرفاً value/options/onChange دریافت کند و feature/store import نکند.

برای نسخهٔ اول native select با label معتبر انتخاب مطمئن و کم‌هزینه‌ای است. اگر طراحی dropdown سفارشی خواست، از Listbox موجود Headless UI استفاده شود؛ نقش ARIA منو برای فرم select به‌صورت دستی اختراع نشود.

| کنترل | گزینه‌ها | قرارداد |
| --- | --- | --- |
| تم | روشن، تیره، سیستم | انتخاب واقعی choice را نشان دهد؛ system با resolved فعلی اشتباه نشود |
| زبان | فقط enabledLocales | نام بومی فارسی / العربية / English؛ انتخاب فعلی مشخص |
| ظرف | variant عادی / روی hero | کنتراست هر دو تم؛ رنگ متن hero مستقل از choice تم |

## جانمایی

- دسکتاپ: داخل HeaderDesktopNav کنار session/profile، با shrink-0 و بدون افزودن فلو ورود جدید. نسبت‌های فعلی w-50% و w-2/5 بررسی شوند؛ کنترل‌ها نباید search را بیرون viewport ببرند.
- موبایل خانه: یک دکمهٔ preferences با پنل دو select یا جای مناسب در منوی پروفایل موجود؛ حالت homeSearchInView و جایگزینی search هنگام scroll پوشش داده شود.
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
