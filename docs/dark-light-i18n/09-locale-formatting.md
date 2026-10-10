# فیچر ۰۹ — نمایش locale بدون تغییر قرارداد رزرو

مبنا: `feat/new-app@c8e26fff` · وابسته به ۰۳ و ۰۴ · خروجی: عدد/پول/تاریخ قابل ترجمه، منطق تجاری ثابت.

## منابع واقعی برنچ

| مسیر | رفتار فعلی که باید حفظ شود |
| --- | --- |
| helpers/formatToman.ts | عدد کامل + واحد تومان |
| helpers/formatCompactToman.ts | خروجی فشردهٔ هزار/میلیون؛ قیمت غیرمثبت خالی |
| helpers/formatCalendarCellPrice.ts | **گردکردن تومان/۱۰۰۰ بدون پسوند**؛ ۳٬۱۰۰٬۰۰۰ → 3100 |
| helpers/formatHour.ts | ساعت ۲۴ساعته با padding؛ null/empty خالی |
| helpers/numberWithCommas.ts | regex separator؛ برای falsy عدد 0 |
| helpers/NumberConverter.ts | p2e فقط رقم فارسی؛ مقدار 0 را فعلاً خالی می‌کند |
| features/reservations/mappers/reservation-dates.ts | جلالی jYYYY/jMM/jD ↔ API YYYY-MM-DD؛ parse strict |
| features/reservations/lib/stay-range.ts | day key، شب‌ها، reserved dates، حداکثر ۱۵ شب و checkout |
| features/reservations/lib/stay-from-query.ts | بازه و guests از query |

تقویم یک مصرف‌کننده نیست: `components/elements/JalaliCalendar`، `components/modules/PropertyContact/parts/ReservationDatePicker`، `PropertySearchFilters/parts/DateRangePicker`، `PropertyBooking/parts/StayCalendarGrid.client.tsx` و ابزار مالک هرکدام بررسی شوند. فقط تغییر DatePicker قدیمی کافی نیست.

## قرارداد عدد و پول

فرمت display از مقدار domain جدا باشد؛ هیچ خروجی Intl دوباره به API، quote یا Number ارسال نشود. locale به helper خالص صریح داده شود؛ global mutable برای locale ممنوع.

- fa: در migration نخست ظاهر عدد فعلی و هزارگان حفظ شود؛ تغییر به رقم Unicode فارسی PR بصری جداست. ar: arab، en: latn؛ policy با font-feature فیچر ۰۶ هماهنگ باشد.
- واحد همیشه تومان است؛ Intl currency=IRR به معنی ریال است و جایگزین تومان نیست. تغییر زبان تبدیل ارز یا ضرب/تقسیم ۱۰ ایجاد نمی‌کند.
- formatToman، formatCompactToman و formatCalendarCellPrice سه قرارداد جدا هستند؛ compact کردن قیمت سلول تقویم با M/K تخلف از رفتار فعلی است. برای سلول، label ترجمه‌شدهٔ «هزار تومان» و قیمت کامل قابل‌دسترس ارائه شود.
- صفر، null، undefined، منفی و عدد نامعتبر تفکیک شوند؛ zero با !value ناپدید نشود مگر قرارداد همان helper عمداً چنین باشد.
- p2e با نام/امضای موجود به normalize digits جدید delegate شود که هر دو بازهٔ ۰–۹ و ٠–٩ را می‌شناسد. تغییر رفتار p2e(0) یک fix صریح با بررسی call siteهاست؛ legacy inputهای null-ish نباید بی‌دلیل crash کنند.

لایهٔ پیشنهادی `helpers/intl/` برای توابع pure نمایش است؛ wrapperهای موجود با پیش‌فرض fa قرارداد خود را حفظ کنند. domain currency، rounding و date conversion داخل feature موجود باقی می‌ماند.

## تاریخ، ساعت و timezone

نوع دادهٔ **روز اقامت** از timestamp جداست. YYYY-MM-DD یک روز تقویمی است؛ new Date(value).toISOString ممکن است روز را در timezone دیگر جابه‌جا کند و مسیر تبدیل رزرو نیست. parser و adapter موجود تنها مرز تبدیل payload بمانند. در این فیچر قاعدهٔ reservedDates و checkout در stay-range بازنویسی نشود.

برای timestamp واقعی مثل پیام چت، Intl.DateTimeFormat با timezone صریح Asia/Tehran استفاده شود؛ timezone سرور/مرورگر نباید خروجی متفاوت بسازد. ساعت check-in/out زمان محلی اقامتگاه و ۲۴ساعته می‌ماند؛ تغییر زبان نباید 15 را 03 یا ساعت UTC کند. relative time با now مشترک و قابل کنترل محاسبه شود؛ SSR و hydration به زمان دو اجرای متفاوت وابسته نباشند.

moment-jalaali حذف نمی‌شود. برای فرمت localized از locale روی instance استفاده شود؛ moment.locale یا loadPersian per-request جهانی ممنوع است. mapper فعلی loadPersian در سطح module دارد؛ مصرف آن برای زبان‌های دیگر باید با adapter instance کنترل شود و همزمانی زبان‌ها تست شود.

## میلادی به‌عنوان milestone مستقل

در عرضهٔ UI سه‌زبانه، رزرو برای همه جلالی با ماه/روز و راهنمای ترجمه‌شده است. تغییر به میلادی هنوز قابلیت آماده‌شده نیست. برای اضافه‌کردن آن:

1. interface مستقل calendar برای daysInMonth، weekday، month navigation و تبدیل day key تعریف شود؛ UI locale و calendar choice جدا باشند.
2. تمام چهار خانوادهٔ تقویم و owner board پوشش داده شوند؛ fa/Jalali رفتار پیشین را حفظ کند.
3. payload شبکه برای **یک روز اقامت یکسان** در دو نمایش دقیقاً برابر باشد؛ فرمت API موجود YYYY-MM-DD باقی بماند.
4. leap year جلالی/میلادی، مرز ماه/سال، checkout روی روز reserved، ۱۵/۱۶ شب و timezoneهای متفاوت تست پایدار داشته باشند.

## پذیرش، ریسک و برگشت

- ارقام فارسی و عربی ورودی به Latin تبدیل و دادهٔ عددی یکسان ارسال می‌شوند؛ متن معمولی بی‌دلیل normalize نمی‌شود.
- formatCalendarCellPrice(3100000) همچنان 3100 است؛ full price و compact price در جای درست باقی می‌مانند.
- تغییر locale، تعداد شب، quote، guest count، مقدار تومان و payload check-in/out را تغییر نمی‌دهد.
- timestamp چت در timezone سرور و مرورگر متفاوت hydration mismatch ندارد؛ date-only روزش ثابت است.
- سناریوهای صفر/null، تاریخ نامعتبر، مرز سال، reserved checkout و دو locale همزمان تست حفظ‌شونده دارند؛ این منطق پرریسک مستحق تست است.
- چک‌های فیچر ۱۰ پاس شوند. rollback helper به‌صورت جدا و rollback چندزبانه با enabledLocales=fa انجام شود.

## وضعیت پیاده‌سازی

لایهٔ نمایش جدا از منطق رزرو ساخته شد؛ خروجی فارسی همان قبل است و منطق رزرو دست نخورده (به‌جز یک اصلاح صریح پایین).

- **`helpers/intl/` (pure، locale صریح، بدون global):** `digits.ts` (`normalizeDigits` برای ۰–۹ و ٠–٩، `localizeDigits`: ar عربی-هندی، fa و en لاتین)، `number.ts` (`formatNumber`، `formatTomanAmount`، `formatCalendarCellPriceFor`)، `jalali.ts` (`formatJalaliDisplay`)، `chat-time.ts` (`formatTimestamp`). wrapperهای قدیمی (`formatToman`، `formatCalendarCellPrice` با پارامتر اختیاری locale، `numberWithCommas` بدون تغییر) پیش‌فرض fa و قرارداد خود را دارند. واحد همیشه تومان است؛ `Intl currency` به‌کار نرفت. compact کردن قیمت سلول تقویم نداریم و `formatCalendarCellPrice(3100000)` همچنان `3100` است.
- **p2e:** با همان نام و امضا به `normalizeDigits` delegate می‌کند؛ ورودی عربی-هندی هم تبدیل می‌شود. `p2e(0)` هنوز `""` است (تغییرش fix جدا با بررسی call siteهاست).
- **تاریخ برای نمایش:** `formatJalaliDisplay` برای fa دقیقاً خروجی moment است. برای ar/en نمونهٔ moment با locale انگلیسی (ارقام لاتین، بدون دست‌زدن به global) و نام ماه/روز از پیام‌ها (`calendar.jMonth1..12` جدید + `calendar.inquiry*`) و ar رقم عربی-هندی می‌گیرد؛ جداکنندهٔ «،» در en به «,» می‌رود. تقویم در هر سه زبان جلالی می‌ماند. hookها: `useFormatNumber`، `useFormatToman` (حالا locale‌دار)، `useJalaliFormat`، `useFormatTimestamp`، `useAmountInWords`.
- **timestamp واقعی:** پیام چت، لیست چت، ارتقای عکس، جزئیات رزرو (`created_at`) با `Intl.DateTimeFormat` و `timeZone: "Asia/Tehran"` ساخته می‌شوند؛ خروجی به timezone مرورگر/سرور وابسته نیست. روز اقامت (date-only) و payload رزرو از این مسیر نمی‌گذرند.
- **مصرف‌کننده‌ها:** نمایش‌های قیمت و عدد (کارت، تک‌آگهی، خلاصه و جزئیات قیمت، فیلترها، ViewsChart، پلن مشاور، پرداخت‌ها)، سلول قیمت سه تقویم، عنوان ماه و برچسب روز در تقویم اقامت جدید، نوار فیلترها، DateFilter، هیرو، قرارداد/prefill تماس، HostCard، نظرات، جزئیات رزرو. زیر ورودی‌های قیمت، فارسی همچنان «مبلغ به حروف» دارد؛ ar/en عدد گروه‌بندی‌شده می‌بینند (کلمات عددی ar/en وجود ندارد).
- **اصلاح صریح parser:** `jalaliDateToApiDate` با `strict` هم `1404/12/30` را به `2026-03-21` و `1404/13/1` را به `2026-03-22` می‌برد (moment-jalaali در strict روز وجود‌نداشتن ماه را رد نمی‌کند). حالا روز با `jDaysInMonth` هم سنجیده و رد می‌شود؛ فقط ورودی نامعتبر رفتارش عوض شد.
- **تست حفظ‌شونده:** `yarn test:intl` (Node `--test`، بدون وابستگی) ۱۷ سناریو: ارقام، صفر/null، سلول تقویم (`3100`، گرد کردن، خالی)، timestamp مرز شب تهران، جلالی fa/en/ar، رفت‌وبرگشت جلالی↔API، سال کبیسه ۱۴۰۳، مرز سال، روز نامعتبر، و ثبات در سه timezone.
- **عمداً ثابت/باقی‌مانده:** رقم فارسی Unicode در fa (PR بصری جدا)؛ ساعت check-in/out لاتین و ۲۴ساعته؛ `Num2Persian` و `timeLeft`؛ نام ماه/روز در چهار خانوادهٔ تقویم قدیمی (JalaliCalendar، ReservationDatePicker، SearchDateRangePicker و owner board) هنوز فارسی است چون منطق جستجوی روز به نام فارسی وابسته است؛ تاریخ‌های عددی بلاگ/اعلان/پشتیبانی لاتین می‌مانند؛ میلادی milestone جدا؛ `moment.loadPersian` سطح module همچنان در چند فایل global است و حذفش به کار جدا نیاز دارد؛ `formatCompactToman` در این برنچ وجود ندارد.

بررسی: tsc، lint (۱۰ خطا/۴ هشدار پایه)، `i18n:check` (۹۶۱ پیام)، `i18n:namespaces`، `direction:check`، `test:intl` و build حالت fa-only پاس شدند. ۵ صفحهٔ پایدار در ۳۹۰ و ۱۲۸۰ قبل/بعد هندسهٔ یکسان دارند و en/ar بدون خطای کنسول لود می‌شوند. صفحه‌های داده‌دار (تقویم اقامت، چت، پرداخت‌ها) به backend نیاز دارند و انجام نشدند.
