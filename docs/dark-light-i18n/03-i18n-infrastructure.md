# فیچر ۰۳ — زیرساخت زبان با قرارداد رندر و کش

مبنا: `feat/new-app@c8e26fff` · پیش‌نیاز: ممیزی · وابستگان: ۰۴، ۰۵، ۰۶، ۰۸، ۰۹.

## وضعیت و انتخاب معماری

Next 16.2.10 و React 19.2.7 نصب‌اند؛ next-intl نصب نیست. html در `app/layout.tsx` ثابت fa/rtl است. AppShell نشست و realtime را مدیریت می‌کند و `app/layout-provider.client.tsx` QueryClient را نگه می‌دارد. `proxy.ts` گیت Basic Auth، SSO، auth guard، canonical و redirect_check دارد؛ `/api/backend/[...path]` هم پراکسی واقعی و allowlist دارد.

برای فاز اول next-intl **بدون locale routing** اضافه شود؛ routeهای موجود و parallel/intercepted routeها جابه‌جا نشوند. نسخهٔ سازگار با peer dependencies انتخاب و با Yarn ثبت شود؛ نسخهٔ latest بدون بررسی تضمین سازگاری ندارد. config موجود Next با plugin wrap شود، نه جایگزین؛ تنظیم تصاویر، headers، rewrites و cache باقی بمانند.

## وضعیت پیاده‌سازی

زیرساخت پیاده شد (`next-intl@4.14.6`، pin دقیق؛ نسخهٔ ۱۸ روزه با peer `next ^16`): `i18n/{config,request}.ts`، `messages/{fa,ar,en}.json` (کپی نمونهٔ starter، نه ترجمهٔ کامل)، `types/i18n.ts`، `hooks/useLocaleSwitch.ts`، plugin روی `next.config.ts` و `NextIntlClientProvider` در `app/layout.tsx` برای namespaceهای common/header/theme/language/errors. `NEXT_PUBLIC_ENABLED_LOCALES` در `.env.example` مستند شد و پیش‌فرض خالی = فقط fa. هنوز هیچ کنترل زبانی در UI نیست (فیچر ۰۵) و هیچ متنی مهاجرت نشده (فیچر ۰۴)، پس با چندزبانه فقط `lang`/`dir` و پیام‌های provider عوض می‌شوند، نه متن صفحه‌ها.

خروجی `yarn build` (۲۷ route ایستا قبل از تغییر): با fa-only جدول route **عیناً** برابر قبل است؛ با `fa,ar,en` هر ۲۷ route ایستا dynamic می‌شود (۰ ایستا)، که همان هزینهٔ پیش‌بینی‌شدهٔ بالاست و باید پیش از روشن‌کردن در production با TTFB سنجیده شود. روی build production آزمایش شد: بدون کوکی/`xx`/`de` → `fa-IR`/`rtl`؛ `en` → `en`/`ltr`؛ `ar` → `ar`/`rtl`؛ با fa-only کوکی en/ar/نامعتبر همچنان fa است و هیچ پیام انگلیسی/عربی serialize نمی‌شود؛ در مرورگر cookie + reload، hash را نگه داشت و خطای hydration نداشت. هنوز آزمایش‌نشده: TTFB واقعی، رفتار CDN، intercepted route بعد از reload، Basic Auth/SSO/redirect در حالت چندزبانه و rollback با rebuild.

## تصمیم قطعی locale

`supportedLocales = fa/ar/en` ظرفیت کد است؛ `enabledLocales` خروجی validate‌شدهٔ NEXT_PUBLIC_ENABLED_LOCALES و همیشه شامل fa است. ترتیب resolve:

1. اگر فقط fa فعال است، بلافاصله fa؛ **قبل از cookies/headers**.
2. اگر چند زبان فعال است، فقط کوکی معتبر jayab_locale که عضو enabledLocales است.
3. نبود کوکی، مقدار نامعتبر یا زبان غیرفعال: fa.

در این عرضه Accept-Language تشخیص داده نمی‌شود و bot branch بر اساس User-Agent نداریم. default ثابت باعث می‌شود درخواست عادی بدون کوکی فارسی بگیرد. کوکی فقط ترجیح UI است و auth نیست. request config در Server Component کوکی نمی‌نویسد. [starter](starter/i18n-config.ts.txt) این قرارداد را نشان می‌دهد.

| locale | lang | dir | فرمت متن عمومی | تقویم رزرو |
| --- | --- | --- | --- | --- |
| fa | fa-IR | rtl | فارسی | جلالی |
| ar | ar | rtl | عربی معیار؛ numbering صریح | جلالی با برچسب ترجمه‌شده |
| en | en | ltr | en-US | جلالی با برچسب ترجمه‌شده |

locale فرمت، زبان محتوا و تقویم سه مفهوم جدا هستند. ar_AR منطقهٔ معتبر انتخاب‌شده برای این محصول نیست و حذف می‌شود؛ در فاز UI metadata فارسی باقی می‌ماند (فیچر ۰۴).

## ساختار و اتصال

| فایل جدید/موجود | مسئولیت |
| --- | --- |
| i18n/config.ts | supported/enabled، validation، dir، lang، cookie constants |
| i18n/request.ts | getRequestConfig، resolve request-scoped، import allowlist JSON، timeZone |
| messages/fa.json، ar.json، en.json | ترجمه‌ها؛ فقط نمونه از starter کپی می‌شود |
| types/i18n.ts | augmentation پیام‌ها برای کلیدهای تایپ‌شده |
| hooks/useLocaleSwitch.ts | انتخاب معتبر، persistence و navigation سند |
| app/layout.tsx | getLocale، lang/dir سروری، NextIntlClientProvider |
| next.config.ts | wrap config با createNextIntlPlugin |

provider سروری NextIntlClientProvider دور LayoutProvider موجود قرار بگیرد. ThemeProvider در همان composition اضافه شود؛ providerهای جدا QueryClient یا session ایجاد نشوند. root فقط common/header/theme/language/errors موردنیاز chrome را به کلاینت بدهد. module/page سروری namespaceهای client islandهای زیرمجموعه را انتخاب و provider مربوط را اضافه کند؛ template برای خواندن feature API استفاده نشود. provider تو‌در‌تو messages را خودکار deep-merge فرض نکند؛ namespaceهای والد لازم صریحاً اضافه شوند. Server Components از getTranslations استفاده می‌کنند و کل JSON را serialize نمی‌کنند.

## تغییر زبان و فرم‌های باز

برای عرضهٔ اول کوکی معتبر و host-only نوشته شود (`Path=/; Max-Age=31536000; SameSite=Lax`، Secure روی HTTPS) و **همان URL با reload کامل سند** باز شود. lang/dir قبل از navigation دستی تغییر نکند؛ متن، جهت، RSC، validation و cache کلاینت باید با هم تغییر کنند. router.refresh به‌تنهایی تضمین به‌روزرسانی html در root layout و stateهای client نیست؛ بهینه‌سازی soft switch فقط با تست واقعی به milestone بعد منتقل شود.

reload وضعیت ذخیره‌نشده را از بین می‌برد: کنترل زبان در فلو OTP، ارسال پرداخت/رزرو، فرم ثبت/ویرایش dirty و چت با draft ذخیره‌نشده موقتاً غیرفعال و دلیل آن ترجمه شود. snapshot تم مستقل باقی می‌ماند. URL شامل pathname، query و hash حفظ شود؛ refresh تک‌آگهی intercepted آن را به صفحهٔ مستقیم تبدیل می‌کند، که رفتار پذیرفته‌شدهٔ این فاز است و باید QA شود. locale در تب‌های دیگر به‌طور خودکار reload ایجاد نکند.

## قرارداد رندر و cache

- cookies/headers در root خواندن request-dependent است؛ اجرای proxy یا serverCall به‌تنهایی اثبات dynamic بودن همهٔ صفحه‌ها نیست. خروجی build قبل/بعد برای خانه، فهرست و تک‌آگهی ثبت شود.
- در حالت fa-only، request config سراغ cookies/headers نمی‌رود؛ هنوز باید خروجی build مقایسه شود. با چند زبان و cookies در root، از دست‌رفتن Full Route Cache و افزایش TTFB قابل انتظار است. Data Cache خواندن‌های مستقل از locale الزاماً حذف نمی‌شود.
- اگر performance gate رد شد، fa-only بماند؛ ترفند x-locale header مشکل dynamic را حل نمی‌کند. URL زبانی گزینهٔ ADR جداست.
- پاسخ HTML/RSC وابسته به کوکی نباید در CDN به‌صورت مشترک public cache شود. سیاست Next/CDN بررسی شود؛ Vary: Cookie به‌تنهایی جایگزین طراحی cache نیست.
- فعلاً API فارسی و زبان‌ناوابسته است؛ query keys فعلی حفظ شوند. وقتی endpoint واقعاً locale-sensitive شد، locale ورودی صریح service/server read، query key کارخانه‌ای و prefetch یکسان باشد. stale/gc/REVALIDATE موجود حفظ شوند.
- در `helpers/serverCall.ts` خواندن پنهانی cookies اضافه نشود؛ این helper عمومی نباید routeهای فارسی را اتفاقی dynamic کند.

## API و امنیت

هیچ درخواست browser مستقیم به بک اضافه نشود. مسیر فعلی `apiCall → /api/backend/*` و مرز generated در `lib/api/generated-client.ts` حفظ شود؛ generated فایل‌ها دستی ویرایش نشوند. پشتیبانی backend از locale در این کار اثبات نشده و مانع ترجمهٔ UI نیست. قبل از افزودن Accept-Language، قرارداد endpoint، forward پراکسی allowlist‌شده، cache server و کارخانهٔ query keys باید در یک PR هماهنگ شوند. صرف افزودن header در apiCall کافی نیست؛ generated adapter فعلی headerهای دلخواه را منتقل نمی‌کند.

## پذیرش و برگشت

- fa-only با کوکی en، ar یا نامعتبر همچنان fa-IR/rtl می‌دهد و هیچ ترجمهٔ غیرفعالی serialize نمی‌شود.
- در چندزبانه، fa/ar/en معتبر هم در HTML سرور و هم provider یکسان‌اند؛ بدون کوکی fa است.
- تغییر زبان query/hash را حفظ می‌کند؛ header، modal، toast و validation زبان واحد دارند؛ فرم dirty بی‌صدا از دست نمی‌رود.
- auth، SSO، Basic Auth gate، redirects، canonical، sitemap و route گروه‌ها بدون regression تست شوند.
- داده یا پیام درخواست همزمان fa/en به هم نشت نکند؛ locale mutable جهانی ممنوع.
- route rendering، TTFB و RSC payload قبل/بعد ثبت شود؛ چک‌های فیچر ۱۰ اجرا شوند.
- rollback با rebuild enabledLocales=fa، حتی برای کاربری با کوکی en/ar، واقعاً فارسی را برگرداند.

منابع فنی: [راه‌اندازی App Router در next-intl](https://next-intl.dev/docs/getting-started/app-router)، [قرارداد request config](https://next-intl.dev/docs/usage/configuration)، [رفتار cookies در Next.js](https://nextjs.org/docs/app/api-reference/functions/cookies). این منابع اصل معماری را توضیح می‌دهند؛ رفتار نسخهٔ pinشدهٔ همین repo با build و QA سنجیده شود.
