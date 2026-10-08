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
