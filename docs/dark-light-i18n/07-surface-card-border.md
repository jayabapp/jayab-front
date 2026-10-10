# فیچر ۰۷ — سطوح و کادرها بدون بازطراحی اجباری

مبنا: `feat/new-app@c8e26fff` · وابسته به ۰۱ · تغییر بصری جدا از migration رنگ.

## وضعیت و اصلاح تصمیم قبلی

تک‌آگهی اکنون در `components/modules/PropertyDetails/PropertyDetailsContent.tsx` ترکیب می‌شود. `parts/ListingSection.tsx` section با divider دارد و `PropertySummaryCard.client.tsx` باکس کناری است. ادعای قبلی «این مسیر وجود ندارد» غلط بود. درخواستی برای تأیید طراحی تازه یا artifact قابل‌استناد در این پوشه ثبت نشده؛ بنابراین این سند همهٔ sectionها را به کارت تبدیل نمی‌کند و سند دیگر را خودکار مغلوب اعلام نمی‌کند.

هدف این فیچر تعریف نقش سطح و مرز هماهنگ است. کارت‌شدن هر بخش انتخاب طراحی صریح همان PR است؛ ساختار فعلی divider-based baseline می‌ماند. اگر کارفرما بعداً کارت‌های section را خواست، variant opt-in با screenshot جدا اضافه شود.

## قرارداد اجزا

| نقش | استایل | کاربرد |
| --- | --- | --- |
| صفحه | bg-page | ظرف اصلی |
| panel | bg-surface، border-line-strong، radius فعلی | فرم/گروه مستقل؛ line به‌تنهایی برای لبهٔ کارت کم‌رنگ است |
| floating | bg-surface، border-line، shadow-elevated | popover، modal، باکس شناور |
| muted | bg-surface-muted | ناحیهٔ ثانویه داخل گروه |
| field | bg-surface، border-control، focus واضح | مرز قابل‌تشخیص input |
| separator | border-line | جداکنندهٔ تزئینی بین ردیف‌ها |
| selected/status | token معنایی متن/زمینه + نشانهٔ غیررنگی | tab، chip، پیام وضعیت |

برای ترکیب تکراری classes از constant/variant موجود همان element استفاده شود. component جدید Surface فقط اگر تکرار واقعی دارد در `components/elements/Surface` با props در types/components/elements/surface.ts ساخته شود؛ state یا domain import نداشته باشد. کلاس عمومی `.outline` ساخته نشود، چون با utility و focus outline تداخل نام دارد. wrapper اضافی دور semantic section ضروری نیست.

radiusهای rounded-10 و rounded-20 در config فعلی حفظ شوند؛ تبدیل تمام radiusها به سه عدد شرط این فیچر نیست. padding موبایل و دسکتاپ بر اساس نیاز محتواست، نه blanket p-6 روی تمام ردیف‌ها. کارت داخل کارت و box-shadow روی هر row ایجاد نشود.

## Badge و chip

سه خانواده، همه با لبهٔ ۱px و بدون سایه: **وضعیت** (`bg-status-X-bg text-status-X border-status-X-line` برای danger/success/warning)، **انتخاب‌شده** (`bg-selected text-on-selected border-selected-line`) و **خنثی** (`bg-surface-muted text-ink-muted border-line-strong`). متن حداقل `text-xs` است؛ `text-xxs` فقط برای شمارنده‌های عددی داخل دایره، نه برچسب متنی. selected روی surface فقط حدود ۱٫۱:۱ است، پس همیشه با آیکن، تیک یا ضخامت مرز همراه شود و فقط با رنگ تشخیص داده نشود. `CountBadge` و `PulseDot` در `components/elements/Badge` جای مهاجرت هستند؛ کلاس تکراری را در همان element نگه دارید، نه یک Badge تازه. رنگ خام Tailwind در badge ممنوع است و به توکن وضعیت می‌رود.

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

## وضعیت پیاده‌سازی

مهاجرت رنگ و نقش سطح انجام شد؛ لایت با نگاشت دقیق همان مقدارهای قبلی را دارد و دارک با `data-theme="dark"` (پشت `NEXT_PUBLIC_THEME_ENABLED`) خوانا است.

- **نگاشت مکانیکی (۲۹۶ فایل + globals):** `bg-white→bg-surface`، `bg-canvas→bg-page`، `text-neutral-900/800→text-ink`، `600→text-ink-muted`، `500/400→text-ink-subtle`، `text-neutral-700→text-ink-muted`، `border-neutral-200/300→border-line/line-strong`، `bg-neutral-100/50→bg-surface-muted`، `bg-neutral-200→bg-surface-hover`، `text-brand-600/700→text-link`، `bg-brand-600/700→bg-action/action-hover` (و `text-white` همراه آن → `text-on-action`)، `bg-brand-50/100→bg-selected`، `border-brand-100/200→border-selected-line`، رنگ‌های خام danger/red، success/green، warning/amber/orange به توکن `status-*` و `shadow-card→shadow-surface`. جدول کامل در اسکریپت codemod محلی بود؛ مقدارهای دقیق در لایت: surface، page، ink، ink-muted، ink-subtle، line، line-strong، action، selected. انحراف‌های کوچک و عمدی: `neutral-400→ink-subtle` (کنتراست بیشتر)، `neutral-50→surface-muted`، `neutral-800→ink`، `brand-100→selected`، `danger-500→status-danger`.
- **زیرساخت:** `shadow-surface` و `shadow-elevated` به Tailwind اضافه شد؛ `borderColor.DEFAULT` به `line` وصل شد؛ body/html از توکن `ink` و `surface` می‌خوانند؛ `app-background` و aurora به `page`؛ کلاس‌های glass (panel، field، chip، header، surface) و highlightهای سفید به `--c-surface` منتقل شدند؛ رنگ‌های JS در slider، chart، breadcrumb، spinner و آیکن برگشت AuthHeader به `rgb(var(--c-…))` رفتند.
- **نقش‌ها:** panel (`border-line-strong`) روی BookingPanel، HostCard، MiniInfoCard و اسکلتش؛ floating (`border-line` + `shadow-elevated`) روی Modal، ModalBottomSheet و toast.custom؛ field (`border-control`، hover `ink-muted`) روی FormInput، MultiLineFormInput، SearchForm و StayDateFields؛ backdrop مودال‌ها `bg-overlay`؛ CountBadge از خانوادهٔ status (لبهٔ ۱px، بدون پر) و PulseDot توکن status؛ رنگ نوار کنار toast از توکن status.
- **focus:** قاعده‌های `*:focus`، `button:focus`، `input:focus` با `!important` و `outline:none` گروه input حذف شدند و `:focus-visible` با `outline: 2px solid var(--c-focus)` و offset ۲px جایگزین شد؛ کامپوننتی که حلقهٔ خودش را دارد با `focus-visible:outline-none` همچنان برنده است. در Playwright روی دارک حلقهٔ رنگ focus دیده شد.
- **عمداً ثابت:** سطوح تیرهٔ روی عکس (گالری، کارت‌های عکس‌دار، bulletهای slider، cropper، `bg-black/neutral-900` روی تصویر)، header شفاف روی hero، Map و Splash، دکمه‌های solid قرمز/سبز (`bg-danger-500` و مشابه). footer هنوز `bg-neutral-400/40` است و بعداً بررسی شود.
- **باقی‌مانده (گام ۴ صفحه‌به‌صفحه):** بررسی بصری با داده روی QA برای فهرست، پروفایل، رزرو، چت، support و مالک؛ `text-white` روی رنگ‌های solid غیر action؛ سبک تیرهٔ نقشه؛ تغییر `maximumScale` و `touch-action` (فیچر ۰۷ دسترس‌پذیری) هنوز لازم است.

بررسی: tsc پاک، lint بدون خطای تازه (۱۰ خطا/۴ هشدار پایه)، `i18n:check` و `i18n:namespaces` پاس، build حالت fa-only موفق و ۲۷ مسیر ایستا ایستا ماندند. در آزمایش خودکار کنتراست متن (۸ صفحه، لایت و دارک، ۱۲۸۰px)، لایت و دارک بدون متن زیر ۳:۱ بودند (دو مورد `neutral-700` پیدا و اصلاح شد). backend محلی در دسترس نبود، پس صفحه‌های داده‌دار (تک‌آگهی، رزرو، چت) فقط با کلاس‌ها و بدون screenshot بررسی شدند.
