# فیچر ۰۷ — سطوح و کادرها بدون بازطراحی اجباری

مبنا: `feat/new-app@c8e26fff` · وابسته به ۰۱ · تغییر بصری جدا از migration رنگ.

## وضعیت و اصلاح تصمیم قبلی

تک‌آگهی اکنون در `components/modules/PropertyDetails/PropertyDetailsContent.tsx` ترکیب می‌شود. `parts/ListingSection.tsx` section با divider دارد و `PropertySummaryCard.client.tsx` باکس کناری است. ادعای قبلی «این مسیر وجود ندارد» غلط بود. درخواستی برای تأیید طراحی تازه یا artifact قابل‌استناد در این پوشه ثبت نشده؛ بنابراین این سند همهٔ sectionها را به کارت تبدیل نمی‌کند و سند دیگر را خودکار مغلوب اعلام نمی‌کند.

هدف این فیچر تعریف نقش سطح و مرز هماهنگ است. کارت‌شدن هر بخش انتخاب طراحی صریح همان PR است؛ ساختار فعلی divider-based baseline می‌ماند. اگر کارفرما بعداً کارت‌های section را خواست، variant opt-in با screenshot جدا اضافه شود.

## قرارداد اجزا

| نقش | استایل | کاربرد |
| --- | --- | --- |
| صفحه | bg-page | ظرف اصلی |
| panel | bg-surface، border-line، radius فعلی | فرم/گروه مستقل |
| floating | bg-surface، border-line، shadow-elevated | popover، modal، باکس شناور |
| muted | bg-surface-muted | ناحیهٔ ثانویه داخل گروه |
| field | bg-surface، border-control، focus واضح | مرز قابل‌تشخیص input |
| separator | border-line | جداکنندهٔ تزئینی |
| selected/status | token معنایی متن/زمینه + نشانهٔ غیررنگی | tab، chip، پیام وضعیت |

برای ترکیب تکراری classes از constant/variant موجود همان element استفاده شود. component جدید Surface فقط اگر تکرار واقعی دارد در `components/elements/Surface` با props در types/components/elements/surface.ts ساخته شود؛ state یا domain import نداشته باشد. کلاس عمومی `.outline` ساخته نشود، چون با utility و focus outline تداخل نام دارد. wrapper اضافی دور semantic section ضروری نیست.

radiusهای rounded-10 و rounded-20 در config فعلی حفظ شوند؛ تبدیل تمام radiusها به سه عدد شرط این فیچر نیست. padding موبایل و دسکتاپ بر اساس نیاز محتواست، نه blanket p-6 روی تمام ردیف‌ها. کارت داخل کارت و box-shadow روی هر row ایجاد نشود.

## فرم، focus و لایه‌ها

globals.css outlineهای input/button را حذف کرده است. برای کنترل‌های مهاجرت‌شده focus-visible واقعی با ring/outline قابل تشخیص و offset مناسب هر دو تم فراهم شود؛ رفع مشخص و محدود قواعد مزاحم بر افزودن !important سراسری ترجیح دارد. focus و مرز ضروری field روی زمینهٔ مربوط ۳:۱ هدف دارند. خط تزئینی line لازم نیست همین معیار را داشته باشد.

دکمهٔ primary با action/on-action، hover، disabled و pending پوشش داده شود؛ فقط رنگ نشانهٔ خطا/موفقیت نباشد. سطح toast.custom و modal portal مستقل از تم‌دادن به Toaster رنگ بگیرد. overlay و backdrop نقش جدا از surface دارند؛ عکس، cropper و gallery می‌توانند سطح تیرهٔ ثابت مستند داشته باشند.

## مراحل و مسیرها

1. نقش‌های semantic فیچر ۰۱ در elementهای Button، Form، Modal و Toast با حفظ API props فعلی اعمال شود؛ تغییر signature لازم با همهٔ مصرف‌کنندگان بررسی شود.
2. SiteHeader/SiteFooter و AppOverlays به سطوح مناسب متصل شوند؛ header روی hero transparent باقی بماند و contrast آن جدا سنجیده شود.
3. ListingSection فقط token divider/heading بگیرد؛ PropertySummaryCard، PropertyContact و PropertyBooking سطوح خود را بگیرند. anchorها، sticky offsets و idهای tabs باقی بمانند.
4. فهرست، پروفایل، رزرو، چت، support و مالک صفحه‌به‌صفحه. Skeleton با هندسه و radius محتوای نهایی هماهنگ و سرور-compatible بماند.
5. کلاس قدیمی فقط بعد از بررسی تمام مصرف‌ها حذف شود؛ برای درخت‌سازی UI دوباره پوشهٔ components/shared یا properties قدیمی ساخته نشود.

## پذیرش، ریسک و برگشت

- structural layout تک‌آگهی، sticky summary، ترتیب sectionها و idها ثابت‌اند مگر PR طراحی صریح.
- surface، floating، field و separator در هر دو تم قابل‌تشخیص‌اند؛ toast.custom و dropdown سطح سفید ناخواسته ندارند.
- keyboard focus در Button، Input، Select و Modal دیده می‌شود؛ disabled/pending خوانا و عملکرد ثابت است.
- header/footer ارتفاع جدید ناخواسته، تقویم clipping و rowهای چت کارت تو‌در‌تو ندارند.
- screenshot تغییرهای بصری ثبت، چک‌های فیچر ۱۰ اجرا و rollback با revert همان دسته ممکن باشد.
