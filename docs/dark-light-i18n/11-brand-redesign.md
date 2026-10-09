# فیچر ۱۱ — بازطراحی و جایگزینی برند، فاز دوم

وضعیت: **مشخصات آماده؛ توسعه و انتشار به بعد از پایان dark-light-i18n موکول است.**

تاریخ تأیید محصول: ۲۰۲۶-۱۰-۰۹. مبنای ثبت: `Front/feat/new-app@703ac21b`؛ Back هنگام ممیزی روی `feat/new-app` و Panel روی `main` بود. این‌ها وضعیت ممیزی هستند، نه دستور تغییر برنچ یا تضمین مسیرهای آینده. پیش از توسعه، checkout نهایی هر مخزن و قوانین محلی آن دوباره بررسی شوند.

## هدف و ترتیب اجرا

لوگو و نماد قدیمی جایاب در همهٔ مصرف‌کنندگان برند با طرح‌های تأییدشده جایگزین شوند؛ لوگوتایپ مناسب زبان و زمینه نمایش داده شود و آیکون مرورگر، نصب اپ، پنل، سئو و اعلان‌ها هماهنگ باشند.

ترتیب مصوب: فیچرهای ۰۱ تا ۱۰ → پذیرش dark-light-i18n → آماده‌سازی دارایی برند و کامپوننت مشترک → جایگزینی فرانت → آیکون‌ها/سئو → پنل و بک → QA و انتشار هماهنگ برند.

این سند مجوز اجرای فوری تغییرات runtime نیست. در تهیهٔ آن فقط مستندات و کپی بدون تغییر فایل‌های اصلی SVG اضافه می‌شوند. نه provider/ترجمهٔ جدیدی نصب می‌شود و نه فایل‌های public، APP_LOGO، CMS یا محیط سرور تغییر می‌کنند.

## پیش‌نیاز شروع توسعه

- [ ] خروجی [فیچر ۱۰](10-rollout-and-qa.md) برای محدودهٔ توافق‌شده پذیرفته و commit تحویل ثبت شده باشد؛ صرف وجود اسناد یا پیاده‌شدن موتور تم کافی نیست.
- [ ] قرارداد نهایی locale، زبان‌های فعال، `html[data-theme]` و رفتار resolved theme/فلگ خاموش مشخص باشد. فیچر برند خودش زبان/تم جدیدی فعال نمی‌کند.
- [ ] screenshot مبنا از هدر عادی/روی hero، فوتر، ورود/OTP، اسپلش، دربارهٔ ما و نصب iOS در زبان‌ها و تم‌های فعال موجود باشد.
- [ ] موجودی این سند با کد نهایی و رسانه‌های CMS تطبیق داده شود؛ اسکن سورس، نبود لوگوی قدیمی در تصاویر CMS یا دادهٔ سرور را اثبات نمی‌کند.
- [ ] شاخهٔ هدف Panel و commit مبنای Back/Panel مشخص شوند؛ از روی نام یکسان برنچ در مخزن دیگر تصمیم گرفته نشود.

برای شروع این فاز لازم نیست همهٔ زبان‌های بالقوه حتماً عمومی شده باشند؛ پذیرش فاز قبلی و فهرست صریح زبان‌های فعال ملاک است. قرارداد برند برای هر زبان فعال باید کامل باشد.

## تصمیم‌های مصوب و موارد باز

| موضوع | تصمیم |
| --- | --- |
| فایل‌های اصلی | بدون تغییر نگهداری؛ خروجی مصرفی جدا تولید شود |
| نماد | همان مربع آبی و اجزای سفید/آبی اصلی، بدون invert یا recolor عمومی |
| لوگوتایپ فارسی | نسخهٔ سفید موجود؛ ساخت نسخهٔ آبی با همان مسیرها و فقط fill=`#356EB4` تأیید شده |
| لوگوتایپ انگلیسی | نسخه‌های آبی و سفید موجود |
| زبان فارسی/انگلیسی | `fa` نوشتهٔ فارسی، `en` نوشتهٔ انگلیسی؛ متن قابل‌دسترس از ترجمهٔ نهایی فاز قبلی |
| زبان عربی | تصمیم باز: انتخاب لوگوتایپ فارسی یا انگلیسی باید پیش از عرضهٔ برند در `ar` ثبت شود؛ جهت RTL به‌تنهایی زبان لوگو را تعیین نمی‌کند. در preview بررسی می‌توان نماد مستقل نشان داد؛ این راه‌حل جای پذیرش نهایی ar را نمی‌گیرد |
| زمینه | روشن: آبی؛ تیره یا hero تیره: سفید؛ زمینهٔ خود محل مصرف ملاک است |
| رنگ رابط | رنگ‌های semantic/primitive فاز قبل حفظ شوند؛ آبی طرح با پالت فعلی رابط یکی نیست و این فیچر بازطراحی عمومی پالت ندارد |
| badge تک‌رنگ | خروجی مشتق برای نیاز اعلان، همراه preview و بررسی خوانایی؛ نسخهٔ چندرنگ نماد تغییر نکند |
| Panel/CMS/محیط | PR و مراحل انتشار مشخص؛ این سند به‌تنهایی تنظیم محیط یا محتوای CMS را تغییر نمی‌دهد |

`HeaderBrand.isLight` در کد مبنا به زمینهٔ hero مربوط است، نه انتخاب تم کاربر. تبدیل مستقیم آن به `resolvedTheme === "light"` اشتباه است. override زمینهٔ تیره برای hero/اسپلش حتی در تم روشن معتبر است.

## منابع اصلی و خروجی دارایی‌ها

کپی بایت‌به‌بایت منابع در این پوشه قرار دارد تا توسعه به فایل‌های ریشهٔ workspace وابسته نباشد:

| نام اصلی تحویل‌شده | نسخهٔ مرجع داخل مخزن | ساختار/رنگ |
| --- | --- | --- |
| Jayab (Pictorial)-03-03.svg | [mark.original.svg](brand-source/mark.original.svg) | نماد چندرنگ: `#356EB4`، `#4880C1`، سفید |
| Jayab Blue(Eng Logotype)-03.svg | [wordmark-en-blue.original.svg](brand-source/wordmark-en-blue.original.svg) | انگلیسی آبی |
| Jayab White(Eng Logotype)-03.svg | [wordmark-en-white.original.svg](brand-source/wordmark-en-white.original.svg) | انگلیسی سفید |
| Jayab White(Persian Logotype).svg | [wordmark-fa-white.original.svg](brand-source/wordmark-fa-white.original.svg) | فارسی سفید |

[source-manifest.json](brand-source/source-manifest.json) نام اصلی، تعداد بایت و SHA-256 هر کپی را ثبت می‌کند. این کپی‌ها master هستند و در runtime import نشوند. تغییر master جدید نیازمند نسخه و ثبت منشأ جدید است.

هر چهار فایل `viewBox="0 0 1080 1080"` دارند، بدون text/font یا تصویر خارجی‌اند. محدودهٔ رنگ‌شدهٔ تقریبی در رندر ۱۰۸۰: نماد `574×574`، انگلیسی `778×214` و فارسی `620×240`؛ این اعداد برای ممیزی‌اند، نه دستور crop دقیق. viewBox نهایی با حدود هندسی و حاشیهٔ اپتیکی بررسی شود تا لبه/clip بریده نشود.

در PR دارایی، خروجی‌های پیشنهادی زیر در `Front/public/assets/brand/v2/` تولید شوند:

- `mark.svg`، `wordmark-fa-blue.svg`، `wordmark-fa-white.svg`، `wordmark-en-blue.svg`، `wordmark-en-white.svg` با حاشیهٔ مناسب و نسبت اصلی.
- PNGهای ۹۶، ۱۸۰، ۱۹۲ و ۵۱۲؛ favicon SVG و ICO شامل اندازه‌های کوچک ۱۶/۳۲/۴۸.
- خروجی ۱۹۲/۵۱۲ مخصوص maskable با زمینهٔ یکپارچه و حاشیهٔ امن؛ خروجی عادی جدا باشد. [قرارداد محدودهٔ امن maskable](https://www.w3.org/TR/appmanifest/#icon-masks).
- badge تک‌رنگ اعلان و contact sheet برای review روی زمینهٔ روشن/تیره و اندازه‌های کوچک.

ابزار تولید و نسخهٔ آن، ورودی/خروجی و تنظیمات padding در PR ثبت شوند تا خروجی قابل بازتولید باشد. masterها overwrite نشوند؛ پاک‌سازی SVG شامل حذف metadata بی‌مصرف و مدیریت class/id باشد، بدون تغییر مسیرها و رنگ مصوب. نماد داخل اپ نباید صرفاً برای کوچک‌کردن حجم raster شود.

## قرارداد کامپوننت و اتصال به زبان/تم

ساختار پیشنهادی مطابق برنچ مبنا؛ با ساختار نهایی فاز قبلی تطبیق داده شود:

| محل | مسئولیت |
| --- | --- |
| `components/elements/Brand/Brand.tsx` و `index.ts` | نمایش خالص `mark`، `wordmark` یا `lockup`؛ قابل مصرف در Server/Client |
| `types/components/elements/brand.ts` | props زبان لوگو، گونه، tone، ابعاد و دسترس‌پذیری |
| `lib/brand/assets.ts` | نگاشت خالص و تایپ‌شدهٔ مسیرها/اندازه‌ها؛ بدون cookies، store یا خواندن پنهانی request |
| مصرف‌کنندگان module/layout | انتخاب زبان و زمینه با زیرساخت موجود؛ بدون provider یا store برند جدا |

- element به feature/store/next-intl وابسته نشود؛ والد زبان resolve‌شده و متن دسترس‌پذیر را بدهد. typeها طبق قرارداد معماری در `types` بمانند.
- tone صریح `blue` یا `white` برای زمینهٔ مشخص؛ حالت `auto` در سطوح معمول از همان `html[data-theme]` نهایی استفاده کند. markup اولیهٔ پایدار و CSS برای variant تم ترجیح دارد تا منتظر useEffect نماند و flash لوگوی اشتباه نسازد.
- در حالت دو تصویر برای تم، تصویر پنهان وارد accessibility tree نشود؛ نام برند یک‌بار روی wrapper/link قابل‌دسترس قرار گیرد. لینک خانه نام واضح و focus موجود را حفظ کند.
- ابعاد wrapper از ابتدا مشخص باشند؛ تغییر دارک/لایت باعث جابه‌جایی هدر یا reset فرم/نشست نشود. شکل حروف و نماد در RTL mirror نشود؛ چیدمان با خواص منطقی کنترل شود.
- SVG خارجی در img/ContentImage کلاس و شناسه را ایزوله می‌کند. اگر inline لازم شد، کلاس عمومی `.cls-1` حذف/ایزوله و clip ID برای تکرار نمونه یکتا شود. برای این فایل‌های محلی تنظیم امنیتی SVG سراسری ضعیف نشود.
- grayscale، brightness و invert برای ساخت نسخهٔ سفید حذف شوند؛ از خروجی سفید مصوب استفاده شود. loading/lazy مناسب محل مصرف باشد؛ لوگوی بالای صفحه منتظر lazy بارگیری نماند.

## موجودی جایگزینی — Front

مسیرها نسبت به `Front/` هستند؛ نام‌ها مبنای ممیزی‌اند و پس از فاز قبلی ممکن است جابه‌جا شوند.

| مصرف‌کننده | منبع فعلی | اقدام |
| --- | --- | --- |
| `components/modules/SiteHeader/parts/HeaderBrand.tsx` | `just_title_logo.svg` و `header_mobile_logo.svg` | Brand مشترک؛ حفظ markOnly/alwaysShowTitle، ابعاد موبایل/دسکتاپ و زمینهٔ hero |
| `HeaderDesktopNav` و `HeaderMobileBar` | HeaderBrand | کنترل تمام شاخه‌های نمایش، قبل/بعد scroll و breakpoint xl |
| `components/modules/Auth/Auth.client.tsx` و `AuthOtp/parts/AuthOtpCard.client.tsx` | HeaderBrand | دریافت variant صحیح بدون تغییر فلو OTP |
| `components/modules/SiteFooter/parts/FooterAboutColumn.tsx` | `header_logo.svg` | lockup مناسب زمینه و نام قابل‌دسترس |
| `components/modules/AboutUsContent/AboutUsContent.tsx` | `header_logo.svg` | حفظ نسبت/عرض با دارایی جدید |
| `components/modules/HomeBanners/parts/HomeHeroBanner.client.tsx` | `assets/images/home/home_banner_logo.webp`، فعلاً 320×166 | ترکیب نماد/نوشته به‌جای bitmap؛ review مستقل در هر دو حالت اسلایددار/بدون اسلاید |
| `components/layouts/SplashScreen/SplashLogo.tsx` | SVG قدیمی inline | ترکیب مصوب جدید؛ حفظ lifecycle/مدت نمایش/reduced-motion |
| `components/layouts/SplashScreen/SplashScreen.client.tsx` و `splashStyles.ts` | SplashLogo و زمینهٔ برند | اولین ورود/ورود تکراری، پیش از hydration و پایان اسپلش؛ زمینهٔ ثابت با tone صریح |
| `app/qa-login/page.tsx` | SplashLogo در اندازهٔ کوچک | نماد مستقل و قابل بارگیری بدون نشست گیت |
| `components/modules/ProfileOverview/ProfileOverview.client.tsx` | `logo.svg` | حالت خالی؛ اندازه و opacity بازبینی شوند |
| `components/modules/HomeInstallPrompt/parts/IosPrompt.client.tsx` | `logo.svg` | نماد هماهنگ با Apple Touch Icon جدید |
| `components/modules/ChatRoom/parts/ChatHeader.client.tsx` | fallback به `logo.svg` | شرط بیرونی فعلی fallback را برای تصویر خالی غیرقابل‌دسترسی می‌کند؛ رفتار مورد انتظار در PR مشخص شود، فقط تعویض رشته اثبات نمایش نیست |
| `features/cities/mappers/city-image.mapper.ts` | `mobile_header_logo.svg` | جایگزینی CITY_IMAGE_FALLBACK با نماد |
| `features/properties/mappers/property-image.mapper.ts` و `HomeSearch/parts/PropertyTypeItem.tsx` | `mobile_header_logo.svg` | فقط fallback نوع ملک؛ placeholder عکس واقعی ملک تغییر نکند |
| `app/layout.tsx`، `app/favicon.ico` و root iconهای `public/` | favicon/Apple/manifest | یک خروجی سازگار؛ جلوگیری از تقدم favicon خودکار قدیمی |
| `public/manifest.json` | 96/Apple/192/512 | ابعاد واقعی، purpose و مسیرهای نسخه‌دار؛ فایل Apple فعلی 180 است و معرفی 144 همان فایل اصلاح شود |
| `helpers/basicAuthGate.ts` | allowlist آیکون‌های ریشه | نام جدید در صورت نیاز دقیق اضافه شود؛ درخواست آیکون HTML صفحهٔ گیت نگیرد |
| `features/seo/components/Schemas.tsx` | تصویر CMS در Organization/LocalBusiness.logo | URL مطلق و عمومی برند برای logo؛ فیلد عمومی image بدون بررسی معنا عوض نشود |
| `public/firebase-messaging-sw.js` | نمایش دستی اعلان | icon/badge ورودی و fallback جدید در مسیر نمایش دستی بررسی شود؛ اعلان تکراری ایجاد نشود |

دارایی‌های قدیمی در `public/assets/icons/logo/`: `header_logo.svg`، `header_mobile_logo.svg`، `just_title_logo.svg`، `logo.svg`، `mobile_header_logo.svg` و `new_header_logo.svg`. برای آخری و `public/assets/images/logo/header_mobile_logo.png` مصرف فعال در ممیزی پیدا نشد؛ این به‌تنهایی اجازهٔ حذف نیست. ارجاع CMS، URLهای بیرونی و window rollback بررسی شوند.

## تحویل هماهنگ Panel و Back

مسیرها نسبت به مخزن نام‌برده هستند. قبل از تغییر هر مخزن، قوانین و چک‌های همان مخزن خوانده شوند؛ قرارداد معماری Front به Panel تحمیل نشود.

| مخزن/محل | وضعیت فعلی | خروجی لازم |
| --- | --- | --- |
| Panel: `components/Header/index.tsx` و `DrawerMenu.tsx` | `setting.APP_LOGO` | گونهٔ مناسب هدر/منوی تیره؛ یک URL برای همهٔ زمینه‌ها کافی نیست |
| Panel: `app/auth/page.tsx` و `app/auth/otp/page.tsx` | همان تنظیم | برند هماهنگ بدون تغییر احراز هویت |
| Panel: `components/Table/Cell.tsx` و `components/Show/ShowImage.tsx` | fallback از APP_LOGO | نماد مربع مناسب و fallback محدود، بدون حلقهٔ onError |
| Panel: `components/Form/ImageUploader.tsx` و `VideoUploader.tsx` | `/assets/icons/logo/logo.svg` | جایگزینی fallback محلی، نه محتوای آپلود کاربر |
| Panel: `app/layout.tsx` و `public/` | favicon؛ لینک manifest بدون فایل موجود | آیکون جدید؛ برای نیاز واقعی نصب پنل manifest معتبر اضافه شود، وگرنه لینک شکسته حذف شود |
| Panel: `store/index.ts` | persist تنظیمات در `setting-storage` | refresh/migration هدفمند تنظیم برند؛ auth/session پاک نشود |
| Back: `src/auth/roles/admin/auth-admin.service.ts` | APP_LOGO از env در init-settings | سازگاری پاسخ قدیمی حفظ؛ نمونهٔ env و قرارداد asset جدید مستند شوند |
| Back: `src/main.ts` | APP_LOGO برای customLogo مستندات API | بررسی خوانایی در زمینهٔ واقعی مستندات و URL قابل‌دسترسی |
| Back: `src/firebase/firebase.service.ts` | icon/badge نسبی در دو مسیر multicast و topic | URL عمومی و مطلق از origin معتبر سایت؛ icon رنگی و badge مناسب، هماهنگ با SW |

پیشنهاد سازگار: APP_LOGO فعلی باقی بماند و به lockup خوانا روی زمینهٔ روشن اشاره کند؛ Panel برای نماد/نسخهٔ سفید قرارداد مشخص و fallback محلی داشته باشد. اگر نسخه‌ها باید از سرور قابل تنظیم باشند، فیلدهای افزایشی optional با fallback در PR جدا معرفی شوند؛ APP_LOGO اجباری ناگهان حذف یا تغییر نوع ندهد. برای این کار migration دیتابیس پیش‌بینی نشده است.

برای SEO، APP_LOGO و اعلان، فایل باید بدون نشست و گیت QA قابل دریافت باشد. آیکون اعلان واقعی از میزبان عمومی فایل بارگیری شود؛ origin بک نباید به‌اشتباه origin فایل فرض شود. تغییر محیط عملیاتی و CMS هنگام انتشار در runbook ثبت شود؛ مقدار واقعی env در مخزن کپی نشود.

لوگوهای پرداخت/بانک، اینماد، نمادهای موفقیت پرداخت، آواتار کاربر و placeholder عمومی رسانه در دامنهٔ این کار نیستند. تغییر نام محصول، favicon سایر محصولات یا بازطراحی سایر آیکون‌های UI نیز در این فیچر نیست.

## PRها، انتشار، کش و rollback

| تحویل | محدوده | دروازهٔ خروج |
| --- | --- | --- |
| B0: تطبیق مبنا | commitهای نهایی، موجودی، انتخاب ar در صورت فعال‌بودن | پذیرش فاز قبل و تصمیم‌های لازم ثبت شده |
| B1: دارایی و primitive | خروجی SVG/raster، contact sheet، Brand و typeها | شکل، رنگ، padding، اندازهٔ کوچک و نمایش چند نمونه تأیید شده |
| B2: فرانت | تمام مصرف‌کنندگان جدول Front، hero و splash | screenshot و رفتار زبان/تم بدون flash یا layout shift تازه |
| B3: آیکون و SEO | favicon، manifest، گیت، logo schema، SW | فایل معتبر/عمومی، ابعاد و URL مطلق درست، نصب و اعلان بررسی‌شده |
| B4: Panel/Back | PR جدا برای هر مخزن، قرارداد APP_LOGO و تنظیمات | سازگاری پاسخ، refresh تنظیم و خوانایی همهٔ زمینه‌ها |
| B5: عرضه | انتشار فایل → انتشار کدهای مصرف‌کننده → تنظیم env/CMS لازم | QA روی URL نهایی و شواهد cache/rollback |

شروع هیچ‌کدام از PRهای اجرایی قبل از دروازهٔ فاز قبلی نیست. B3 و B4 بعد از تثبیت قرارداد دارایی می‌توانند مستقل آماده شوند؛ ترتیب deploy باید سازگاری URLها را حفظ کند. feature flag جدید فقط برای این تعویض بصری لازم نیست؛ rollback با revert مصرف‌کنندگان و تنظیمات مستند انجام شود.

- cache فعلی `/assets/*` و root iconهای Front تا ۳۰ روز است؛ overwrite همان URL راه عرضهٔ قابل‌اتکا نیست. دارایی جدید مسیر نسخه‌دار داشته باشد. برای favicon/manifest ریشه، تقدم metadata خودکار Next، نسخهٔ URL و سیاست cache/CDN با هم بررسی شوند؛ query version به‌تنهایی اثبات تازه‌شدن آیکون نصب‌شده نیست.
- ابتدا فایل‌های جدید روی origin مقصد عمومی شوند، سپس Front/Panel/Back به آن‌ها ارجاع دهند. اگر Panel نسخهٔ محلی دارد، از همان master و تنظیم خروجی ساخته و با نسخهٔ برند هماهنگ شود.
- نسخهٔ قبلی تا پایان QA و بازهٔ rollback نگهداری شود؛ مدت بازه در PR انتشار تعیین شود. حذف قدیمی‌ها PR پاک‌سازی مستقل پس از اسکن کد/CMS و بررسی لاگ مصرف است.
- runbook شامل commit هر مخزن، URL دارایی‌ها، مقادیر قبلی/جدید تنظیمات غیرمحرمانه، وضعیت persist پنل و گام revert باشد. تغییر تنظیمات محیط بدون rollback قابل‌بازتولید انجام نشود.
- اپ نصب‌شده ممکن است آیکون قبلی را در cache سیستم نگه دارد؛ نصب تازه و نصب قبلی جدا تست و محدودیت به‌روزرسانی آیکون گزارش شود، نه اینکه نمایش فوری روی همهٔ دستگاه‌ها تضمین شود.

## معیار پذیرش و شواهد QA

- [ ] هیچ مصرف فعال ثبت‌شده بدون نتیجهٔ مهاجرت/استثنای مستند باقی نماند؛ جست‌وجوی نام فایل و SVG inline قدیمی تکرار شود. خود فایل آرشیوی یا منبع این سند خطای اسکن runtime محسوب نشود.
- [ ] fa و en از لوگوتایپ درست استفاده کنند؛ برای ar فعال انتخاب مصوب ثبت و تست شود. زبان resolve‌شدهٔ سرور و مرورگر یکسان باشد؛ i18n جدید برای برند ساخته نشود.
- [ ] light/dark و system با OS روشن/تیره و تغییر زنده پوشش داده شوند؛ با موتور خاموش و کوکی/OS dark همچنان قرارداد light فاز قبل رعایت شود.
- [ ] زمینهٔ hero/اسپلش مستقل از تم بررسی شود؛ اولین paint با filmstrip و اسپلش فعال/غیرفعال سنجیده شود، نه فقط screenshot پس از mount.
- [ ] عرض‌های ۳۲۰، ۳۹۰، ۷۶۸، ۱۴۴۰ و breakpoint هدر ۱۲۸۰؛ متن بلند کنترل‌های زبان، keyboard، zoom ۲۰۰٪ و reduced-motion پوشش داده شوند.
- [ ] همهٔ مسیرهای جدول از جمله ورود/OTP و QA-login، فوتر/درباره، پروفایل، fallback شهر/نوع ملک و راهنمای iOS بررسی شوند؛ تصاویر غیر برند سالم بمانند.
- [ ] SVG clip/style collision، کشیدگی، فضای خالی ناخواسته، hydration warning تازه یا CLS ناشی از لوگو وجود نداشته باشد؛ لینک خانه یک نام قابل‌فهم داشته باشد.
- [ ] favicon خودکار Next و public یکسان باشند؛ ICO/PNG واقعاً اندازه/فرمت اعلام‌شده داشته باشند. manifest بدون 404 و maskable بدون بریدگی جزء مهم نماد باشد.
- [ ] Organization/LocalBusiness.logo به تصویر جدید عمومی و مطلق اشاره کنند؛ canonical/metadata زبان و تصویر عمومی کسب‌وکار بی‌دلیل تغییر نکنند.
- [ ] پنل با تنظیم تازه و persist قدیمی، API docs و fallback خراب بررسی شوند. refresh لوگو نشست کاربر را حذف نکند.
- [ ] اعلان multicast/topic و مسیر SW/نمایش خودکار در محیط تست کنترل‌شده بررسی شوند؛ icon/badge صحیح و فقط یک اعلان دیده شود. ارسال واقعی به کاربران برای QA لازم نیست.
- [ ] cache تازه/قدیمی، کاربر بدون نشست، نصب تازه/قبلی PWA و rollback به نسخهٔ قبل پوشش داده شوند.

چک‌های Front هنگام **پیاده‌سازی** از checkout نهایی اجرا شوند: `yarn lint`، `yarn architecture:check`، `yarn architecture:cycles`، `yarn migration:guardrails`، `yarn theme:check` و `yarn build`. چک زبان مطابق اسکریپت واقعی تحویل فاز قبل اجرا شود؛ نام command آینده به‌عنوان command موجود فرض نشود. چک‌های Panel/Back از package و دستورالعمل همان repo انتخاب شوند. خطاهای baseline جدا از regression گزارش شوند؛ قواعد برای عبور فیچر خاموش نشوند.

برای تغییر مستندات فعلی، بررسی لینک‌های محلی و تطابق SHA-256 کپی‌های master کافی است؛ build اپ، اجرای UI یا قبولی این checklist ادعا نمی‌شود. تعریف اتمام این فیچر: همهٔ تحویل‌های Front/Panel/Back و مراحل محیطی لازم با شواهد بالا پذیرفته شده‌اند، نه صرف اضافه‌شدن فایل SVG به public.
