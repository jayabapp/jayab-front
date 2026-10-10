# فیچر ۰۴ — ترجمهٔ مرحله‌ای، ICU و پیام‌های خارج از React

مبنا: `feat/new-app@c8e26fff` · وابسته به ۰۳ · خروجی: ترجمهٔ رابط با کلیدهای تایپ‌شده.

## وضعیت واقعی

در app/components/features تعداد ۲۶۰ فایل LocalStrings را import می‌کنند. اسکن حروف Arabic-script در ۹۵ فایل فقط **کاندید** متن است: comment، regex، نام بومی زبان و محتوای عمدی هم شمرده می‌شوند. عددهای این دو گروه با هم جمع نمی‌شوند؛ هم‌پوشانی دارند.

متن UI علاوه بر JSX در feature mapperها، schemaهای Yup، helper فرمت، notify و `api_services/common/apicall.helper.ts` است. `PropertyDetailsContent.tsx` tab/breadcrumb را از _STRINGS می‌سازد؛ مهاجرت آن فقط ترجمهٔ leafها نیست.

## وضعیت پیاده‌سازی

**ابزار.** `yarn i18n:check` (parser مستقیم `@formatjs/icu-messageformat-parser@3.5.19`): JSON معتبر، رشتهٔ non-empty، برابری leaf keyها با fa، ICU معتبر با `other`، selectorهای plural مجاز همان زبان، برابری نام/نوع آرگومان‌ها و tag از allowlist (`b i em strong br link`). `yarn i18n:namespaces` گراف import هر entry اپ را می‌خواند، namespaceهای مصرف‌شده در فایل‌های کلاینت را حساب می‌کند و اگر `ROOT_NAMESPACES` در `app/layout.tsx` یا `<IntlNamespaces namespaces={[…]}>` همان page کم داشته باشد شکست می‌خورد؛ همچنین هر رشتهٔ شبیه کلید (`ns.key`) که در `messages/fa.json` نباشد را گزارش می‌کند (برای helperهایی که translator شل می‌گیرند و TypeScript کلیدشان را نمی‌سنجد).

**مهاجرت.** همهٔ مصرف‌های `_STRINGS` و متن‌های فارسی خودبسندهٔ کامپوننت‌ها منتقل شد (۹۴۹ پیام × سه زبان؛ مقدار fa هر کلید با مقدار اصلی `_STRINGS` یکی است): جستجو و شهر، فهرست و جزئیات آگهی، فیلترها و مرتب‌سازی، رزرو و تماس، چت، احراز هویت و OTP، پروفایل و پشتیبانی، مالک و بهبود تصویر، مشاور، محتوا/بلاگ/FAQ، فرم‌ها و مودال‌ها، toastها، aria-label/alt/title و منوی پروفایل. `utils/LocalStrings.ts` فقط سه کلید metadata صفحهٔ `/rooms` را نگه می‌دارد (metadata فارسی می‌ماند). ۱۱۶ کلید بی‌مصرف و کدهای مرده (`formatCompactToman`، `MinuteToHour`، `ReserveReqTypes`، `menuDropDownItems`، `simpleWeekDays`، `ShareButton`) حذف شدند.

**الگوها.** کامپوننت async از `getTranslations`، بقیه از `useTranslations`. helperهای خالص translator یا واژه‌ها را صریح می‌گیرند (`createPropertySteps(id, t)`، `buildLocationLabel(entries, words)`، `contactPrefillValues`)؛ `useFormatToman` و `useListSeparator` نسخهٔ hook هستند. اسکیماهای Yup و `apiCall` پیام را به‌صورت کلید می‌دارند و `YupValidator`/`handleError` با `lib/i18n/browser-translator.ts` ترجمه می‌کنند (provider ریشه translator را یک‌بار می‌سپارد؛ فقط namespaceهای ریشه مثل `common/auth/errors` از این مسیر ترجمه می‌شوند). عبارت‌های «عدد + اسم» ICU plural شدند تا عربی (zero/one/two/few/many) و انگلیسی درست جمع بسته شوند؛ fa از `other` با `{count}` خام استفاده می‌کند تا رقم‌ها دست‌نخورده بمانند. provider صفحه با `<IntlNamespaces>` به provider ریشه merge می‌شود (برخلاف nested ساده، namespaceهای والد گم نمی‌شوند).

**عمداً بیرون این فاز.** متن‌های وابسته به API/CMS و محتوای فارسی backend (عنوان آگهی، قوانین/توضیحات، `messages.fa`، مقایسهٔ `includes("نیست")`)، metadata/JSON-LD، پیام‌های route handlerهای سرور، نام ماه/روز جلالی و `moment.loadPersian` و `daysOfOurLives` (منطق تقویم)، ارقام و واژهٔ‌های `Num2Persian`/`timeLeft`/`numberWithCommas`، جداکنندهٔ `search-option-draft`، فرمت تاریخ `dddd، jD jMMMM`، ابزار داخلی `TestAccessManager`، صفحهٔ `qa-login` و ویجت محصول داخل HTML-CMS (`convertHTMLtoReact`) — گروه فرمت‌دهی فیچر ۰۹ یا محتوای backend‌اند. ترجمهٔ عربی و انگلیسی (به‌ویژه عبارت‌های مالی/رزرو/حقوقی) بازبینی انسانی ندارد؛ تا آن زمان و تا پایان فیچر ۰۸ (RTL/LTR) `NEXT_PUBLIC_ENABLED_LOCALES` باید `fa` بماند.

## قرارداد پیام

namespaceها: common، header، theme، language، auth، listing، search، profile، chat، reserve، owner، errors، validation. کلید بر اساس مفهوم باشد: ورود حساب و ساعت ورود یک کلید ندارند. fa منبع key schema است؛ هر سه زبان leaf key برابر، مقدار non-empty و نام/type آرگومان ICU یکسان دارند.

- از ICU parser استفاده شود؛ regex برای parse nesting و plural کافی نیست.
- selectorهای plural بین زبان‌ها الزاماً یکسان نیستند؛ وجود other الزامی است. برای عربی نمونه‌های ۰، ۱، ۲، ۳، ۱۱، ۱۰۰ بررسی شوند. فارسی نیز طبق Intl.PluralRules رفتار one/other دارد؛ برای جمله‌های دارای متن یکسان می‌توان فقط other نوشت.
- ترجمهٔ rich text فقط با tag allowlist و t.rich باشد؛ HTML خام به dangerouslySetInnerHTML نرود.
- توضیح مترجم در فایل جدا مثل messages/context.json قرار گیرد؛ _context داخل message runtime اضافه نشود.
- کلید ناموجود fallback فارسی **واقعی** با همان آرگومان و formatter نیاز دارد؛ برگرداندن namespace.key fallback فارسی نیست. عرضه با key خام یا fallback تأییدنشده مجاز نیست.
- [starter فارسی](starter/messages/fa.json)، [عربی](starter/messages/ar.json) و [انگلیسی](starter/messages/en.json) نمونهٔ محدودند؛ ترجمهٔ کامل برنامه نیستند. عنوان قانونی و محتوای عربی نیازمند بازبینی انسانی‌اند.

## روش مهاجرت

1. فهرست کلیدهای مصرف‌شده از TypeScript AST، نگاشت به namespace و ثبت مسیرهای migrated. LocalStrings فعلاً ثابت و فارسی باقی بماند؛ proxy/getter جهانی بر اساس cookie ممنوع.
2. Server Component از getTranslations و client island از useTranslations استفاده کند. type augmentation در types/i18n.ts کلیدها را به schema فارسی محدود کند. هیچ template به client component تبدیل نشود.
3. feature mapperها label دامنهٔ ثابت را به ترجمهٔ module منتقل کنند یا translator خالص تزریق‌شده بگیرند؛ hook React یا UI module از features import نشود.
4. schemaهای Yup در factory با translator ساخته شوند؛ schema singleton متکی به زبان زمان import نباشد. برای تغییر زبان validate مجدد پس از navigation و پیام درست لازم است. YupValidator فقط یک toast ایجاد کند.
5. constants/helperهای موردنیاز ترجمه locale یا translator را صریح بگیرند. این ورودی request-scoped است؛ مقدار آخرین درخواست در global ذخیره نشود.
6. ابتدا SiteHeader/SiteFooter/AppShell، سپس PropertyDetails/PropertyContact/PropertyBooking، جستجو، پروفایل، رزرو، چت، محتوا و مالک. هر دسته با مسیرهای واقعی ممیزی انجام شود.

## toast، API و محتوا

`apiCall` فعلی messages.fa و متن فارسی network/session/server دارد. ترجمهٔ wrapper کافی نیست. پیام‌های **ساخته‌شده در فرانت** به key مشخص تبدیل و در adapter مرورگر با locale فعال ترجمه شوند؛ transport به hook/context UI وابسته نشود. server call هیچ state mutable مرورگر مصرف نکند.

پیام backend فاقد code و ترجمهٔ معتبر همان متن فعلی می‌ماند؛ مترجم ماشینی در runtime یا پنهان‌کردن جزئیات validation با generic message راه‌حل این فاز نیست. contract پیام API باید جدا مستند شود. notify در لایهٔ apiCall و caller دو بار اجرا نشود. `_STRINGS` وقتی تمام مصرف‌ها، schemaها و helperها مهاجرت شدند حذف می‌شود.

عنوان آگهی، شهر/محله، توضیحات میزبان، CMS و متن پیام کاربران ترجمه نمی‌شوند؛ با bdi/dir=auto نمایش داده شوند. این موارد استثنای مکتوب اسکن‌اند. عنوان و description metadata/CMS فارسی باقی می‌مانند، درحالی‌که html lang زبان UI است؛ این محدودیت فاز UI باید در گزارش عرضه مشخص باشد. تغییر openGraph.locale به عربی/انگلیسی بدون ترجمهٔ metadata انجام نشود. hreflang برای URL یکسان ساخته نشود.

## ابزار و پذیرش

در PR اجرایی `scripts/i18n/check.mjs` با ICU parser مستقیمِ devDependency ساخته شود و به yarn i18n:check وصل شود: parity، non-empty، ICU syntax، آرگومان‌ها، other و rich-tagها. dependency transitive بدون ثبت مستقیم استفاده نشود. unused-key scan فقط گزارش است؛ کلیدهای دینامیک را با grep حذف نکنید.

- check روی پیام‌های واقعی برنامه موفق و برای missing key، ICU خراب و آرگومان ناسازگار شکست قابل‌فهم دارد.
- همهٔ متن‌های UI گروه تکمیل‌شده شامل aria-label، title، alt، خطا، validation و toast ترجمه می‌شوند؛ استثناهای محتوای API ثبت می‌شوند.
- هیچ key خام در UI و هیچ singleton زبان‌وابسته وجود ندارد؛ render همزمان دو زبان مستقل است.
- پیام‌ها فقط namespaceهای لازم هر subtree را به client می‌رسانند؛ providerهای nested والد لازم را صریح حفظ کنند.
- ترجمهٔ عربی و عبارت‌های مالی/رزرو تأیید انسانی دارند؛ semantics رزرو تغییر نمی‌کند.
- چک‌های فیچر ۱۰ و screenshot سه زبان اجرا شود. rollback هر دسته با revert، و rollback عرضه با enabledLocales=fa است.
