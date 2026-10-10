# فیچر ۰۸ — جهت منطقی با حفظ نمای فارسی

مبنا: `feat/new-app@c8e26fff` · وابسته به ۰۳ · پیش‌نیاز عرضهٔ انگلیسی.

## مشکل مهم طرح قبلی

در صفحهٔ فعلی RTL، چپ فیزیکی برابر **end** و راست فیزیکی برابر **start** است. تبدیل ml به ms یا left به start نمای فارسی را برعکس می‌کند. جایگزینی باید از نقش و baseline RTL بیاید، نه صرف نام کلاس.

| فعلی در RTL | معادل برای حفظ ظاهر RTL | فقط اگر نقش همین باشد |
| --- | --- | --- |
| ml-* / mr-* | me-* / ms-* | فاصله در انتها / ابتدا |
| pl-* / pr-* | pe-* / ps-* | padding انتها / ابتدا |
| left-* / right-* | end-* / start-* | اتصال به انتها / ابتدا |
| text-left / text-right | text-end / text-start | تراز متن مطابق جریان |
| border-l / border-r | border-e / border-s | مرز انتها / ابتدا |
| rounded-l-* / rounded-r-* | rounded-e-* / rounded-s-* | لبهٔ انتها / ابتدا |

این جدول codemod کور نیست. element دارای dir=ltr، row-reverse، محتوای تصویر یا transform نیازمند تحلیل جداست. pairهای وسط‌چین left-1/2 با -translate-x-1/2 فیزیکی صحیح‌اند و لازم نیست تغییر کنند.

## قرارداد اجرا

- گرهٔ html از سرور dir می‌گیرد. جهت از locale config، و برای زیر‌درخت متفاوت از dir خود آن گرفته شود؛ constant global که آخرین locale را نگه می‌دارد ممنوع.
- flex-row در RTL خودش جریان راست‌به‌چپ دارد؛ row-reverse برای «رفع RTL» پیش‌فرض نیست. ترتیب DOM و خواندن screen reader بررسی شود.
- جهت فلش back/next از معنای فلش و جهت واقعی baseline آن بیاید. rotate-180 عمومی روی تمام آیکون‌ها ممنوع؛ لوگو، قلب، ساعت و عکس آینه نمی‌شوند.
- متن کاربر، عنوان و نام شهر با bdi/dir=auto؛ تلفن، URL، کد و ایمیل با dir=ltr. مقدار پول داخل عبارت ترجمه‌شده از bidi isolation استفاده کند.
- margin/padding/position و anchor portal بررسی شوند؛ styleهای inline و CSS globals نیز در محدوده‌اند. grep فقط کاندید می‌دهد.

## کتابخانه‌ها و مسیرهای واقعی

| بخش | اقدام |
| --- | --- |
| SiteHeader/HeaderMobileBar | absolute left فعلی و mr-auto بر اساس baseline RTL بررسی شوند؛ سه return موبایل پوشش داده شود |
| PropertyDetails/SectionTabs، PropertyGallery | scroll anchor، تب، carousel و prev/next مستقل از order متن درست باشند |
| JalaliCalendar و date pickerهای Search/PropertyContact | ترتیب روزها و انتخاب بازه از locale و منطق تاریخ تفکیک شود؛ LTR شدن نباید date payload را عوض کند |
| Embla/Swiper | API نسخهٔ نصب‌شده بررسی؛ dir واقعی container و گزینهٔ direction متناظر تنظیم و در صورت نیاز reInit شود. prop ساختگی rtl اضافه نشود |
| Slider | رفتار reverse مطابق نسخه و کم/زیاد؛ DOM order و keyboard arrows آزمایش شوند |
| motion/drawer | علامت x از معنای start/end؛ drag و close gesture در هر دو جهت تست شود |
| Toast و AppOverlays | محل نمایش و border جهت‌دار از locale؛ toast.custom جدا بررسی شود |
| Map | کنترل‌های top-right ممکن است فیزیکی و عمدی بمانند؛ tile/مختصات mirror نشوند |

منطق مشترک direction اگر لازم بود در `hooks/useDir.ts` یا helper خالص locale قرار گیرد؛ عناصر پایه با prop direction مستقل از state اپ کار کنند. لیست استثناهای فیزیکی با مسیر و دلیل در manifest مهاجرت ثبت شود.

## پذیرش و برگشت

- screenshot فارسی قبل/بعد برای هر دسته ثابت است؛ این مهم‌ترین تست تبدیل منطقی است.
- انگلیسی در سه عرض موبایل/تبلت/دسکتاپ چیدمان طبیعی و tab order درست دارد؛ عربی RTL باقی می‌ماند.
- popup، focus، input، carousel، slider، toast و حرکت افقی از viewport بیرون نمی‌روند.
- date range، nights، quote، price و payload شبکه در تغییر جهت ثابت‌اند.
- scanner فقط مسیرهای تکمیل‌شده را سخت‌گیرانه کنترل کند و استثنای مستند را بپذیرد؛ شرط «هیچ left/right در کل repo» معیار حرفه‌ای نیست.
- چک‌های فیچر ۱۰ پاس شوند؛ rollback با revert هر دسته و fa-only قابل انجام است.

## وضعیت پیاده‌سازی

مهاجرت به کلاس‌های منطقی انجام شد؛ فارسی/عربی (RTL) بدون تغییر و انگلیسی (LTR) با چیدمان طبیعی.

- **نگاشت (۱۰۴ فایل، ۲۷۲ کلاس):** `ml/mr→me/ms`، `pl/pr→pe/ps`، `left/right→end/start` (با منفی و prefix)، `text-left/right→text-end/start`، `border-l/r→border-e/s`، `rounded-l/r→rounded-e/s` و گوشه‌ها (`tl→se`، `tr→ss`، `bl→ee`، `br→es`). جفت‌های وسط‌چین (`left-1/2`، `left-[50%]`) و فایل‌های دارای `ltr`/`dir` صریح دست نخوردند. CSS سراسری: فاصلهٔ Embla/thumbs و نقطه‌ها به `margin/padding-inline-*` و `nav-progress` به `inset-inline-start`.
- **جهت از locale:** `hooks/useDir.ts`. `Swiper` و `SwiperWithThumbnails` جهت Embla را از locale می‌گیرند (قبلاً `"rtl"` ثابت بود؛ ۷ مصرف‌کننده پاک شدند). فلش‌های carousel روی سمت فیزیکی می‌مانند و عملشان با `arrowSides()` از جهت می‌آید؛ همین برای `SwiperWithNavigation`. کلیدهای ← → و swipe در PropertyPhotoViewer، HomeHeroBanner و تقویم اقامت، sliderها (`reverse` فقط در RTL و `direction` از locale)، ورودی‌های فرم (`direction` پیش‌فرض و `text-start`) و toast (گوشهٔ end و `border-s`) جهت‌دار شدند.
- **آیکن‌ها:** فلش‌های جهت‌دار (back در موبایل، «ادامه»، ماه قبل/بعد، «دیدن همه») با `ltr:rotate-180` برگشتند؛ شمارندهٔ +/− در LTR به ترتیب − ۰ + دیده می‌شود (`ltr:flex-row-reverse`، ترتیب DOM همان RTL). header دسکتاپ در LTR لوگو را اول رندر می‌کند و ترتیب DOM همان چیزی است که دیده می‌شود. pagination با `me-2/ms-2` و hover جهت‌دار با `rtl:/ltr:`.
- **استثنای فیزیکی ثبت‌شده:** `scripts/direction/exceptions.json` با دلیل هر مسیر (carousel arrowها، ServerSidePaginate، Toast، فیلدهای LTR مشاور و TestAccess، فلش‌های PhotoViewer، روبان مایل قیمت). Map، SplashScreen و محتوای CMS (`float-left/right`) خارج از محدودهٔ مهاجرت‌اند. `yarn direction:check` فقط کلاس فیزیکی جدید خارج از این فهرست را رد می‌کند.
- **مانده:** ViewsChart و برچسب‌های slider (`paddingRight`) هنوز فیزیکی‌اند؛ کنترل‌های Map top-right عمداً ثابت؛ ترتیب Tab در شمارندهٔ LTR با ترتیب بصری یکی نیست.

بررسی: ۵ صفحهٔ پایدار (terms، faq، about-us، contact-us، route-hub) در ۳۹۰ و ۱۲۸۰px قبل/بعد از مهاجرت، برای هر عنصر body (موقعیت و اندازه)، دقیقاً یکسان‌اند (hash هندسه). `/`، `/rooms` و `/auth` به دلیل انیمیشن/توست خودشان بین دو بار اجرا هم تفاوت دارند و قابل مقایسهٔ دقیق نیستند. en و ar در ۳۹۰/۷۶۸/۱۴۴۰ روی ۴ صفحه بدون اسکرول افقی؛ en `dir=ltr`، ar `dir=rtl`. tsc، lint (۱۰ خطا/۴ هشدار پایه)، i18n و `direction:check` پاس، build حالت fa-only موفق. تست دستی با داده (تقویم، تک‌آگهی، چت، carousel واقعی) نیاز به backend دارد و انجام نشد.
