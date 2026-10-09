# فیچر ۰۲ — موتور تم با عرضهٔ کنترل‌شده

مبنا: `feat/new-app@c8e26fff` · وابسته به ۰۱ · مصرف‌کننده: ۰۵.

## وضعیت واقعی و مالکیت

موتور تم، isDark و readerهای قدیمی theme-mode در این برنچ وجود ندارند؛ migration برای state حذف‌شده لازم نیست. RootLayout از `app/layout-provider.client.tsx`، AppShell و MainLayout استفاده می‌کند. لایهٔ جدید نباید bootstrap نشست یا realtime را دوباره ایجاد کند.

منطق خالص در `lib/theme/config.ts` و `lib/theme/bootstrap.ts`؛ state مرورگر در `lib/theme/store.client.ts`؛ هوک در `hooks/useTheme.ts`؛ provider در `components/layouts/ThemeProvider/ThemeProvider.client.tsx` با entry عمومی. typeهای مشترک در `types/theme.ts` و props در `types/components/layouts/theme-provider.ts`. elements از طریق adapter یا props تم می‌گیرد و به store اپ وابسته نمی‌شود.

## وضعیت پیاده‌سازی

موتور پیاده شد و پشت `NEXT_PUBLIC_THEME_ENABLED` (پیش‌فرض خاموش) است: `lib/theme/{config,bootstrap,store.client}.ts`، `hooks/useTheme.ts`، `ThemeProvider` (داخل `app/layout-provider.client.tsx`)، اسکریپت pre-paint در head و `theme` پراپ Toaster در AppOverlays. هنوز کنترلی در UI نیست (فیچر ۰۵) و چیزی توکن را مصرف نمی‌کند، پس حتی با موتور روشن ظاهر صفحه‌ها عوض نمی‌شود. `yarn theme:check` قرارداد اسکریپت و resolver را می‌سنجد (۸۰ حالت). در مرورگر آزمایش شد: کوکی dark، کوکی نامعتبر، OS تیره و تغییر زندهٔ OS، همگام‌سازی BroadcastChannel (پیام نامعتبر رد، بدون بازنویسی کوکی)، و فلگ خاموش با کوکی/OS تیره که `html` را دست‌نخورده می‌گذارد. هنوز آزمایش‌نشده: filmstrip اولین paint با splash، دو تب واقعی، CSP production، JS خاموش.

## قرارداد حالت

```ts
type ThemeChoice = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";
// snapshot پایدار و cache‌شده: choice, resolved, ready, enabled
```

| وضعیت | نتیجه |
| --- | --- |
| NEXT_PUBLIC_THEME_ENABLED غیر از 1 | همیشه light؛ کوکی/OS نادیده گرفته می‌شود |
| موتور فعال، کوکی معتبر | انتخاب ذخیره‌شده |
| موتور فعال، کوکی خالی/نامعتبر | system |
| system | prefers-color-scheme + listener تغییر OS |
| storage یا matchMedia خطادار | fallback روشن، اپ قابل استفاده |

`NEXT_PUBLIC_THEME_CONTROL=1` فقط کنترل را نشان می‌دهد و موتور را فعال نمی‌کند. پیش‌فرض هر دو صفر است. خاموش‌کردن کنترل به‌تنهایی rollback دارک نیست.

## bootstrap و hydration

اسکریپت کوچک و ثابت قبل از paint در head توسط root layout قرار بگیرد؛ afterInteractive مناسب نیست. اسکریپت و store از **یک قرارداد** validate/resolve استفاده کنند و فلگ موتور در هر دو اعمال شود.

- فقط کوکی host-only jayab_theme با allowlist، مرز دقیق مقدار و path / خوانده شود؛ dark-invalid نباید dark شناخته شود.
- bootstrap فقط `data-theme="light|dark"` و style.colorScheme روی html می‌گذارد. توکن‌ها از `html[data-theme="dark"]` می‌خوانند؛ variant اختیاری asset به همین attribute وصل شود.
- سرور cookies تم را در root نمی‌خواند. suppressHydrationWarning فقط روی html برای attributeهای bootstrap مجاز است؛ warningهای زیر‌درخت مخفی نشوند. suppression موجود روی body بازبینی شود.
- snapshot سرور و اولین hydrate ثابت ready:false و light باشد؛ markup وابسته به تم تا ready اندازهٔ ثابت داشته باشد. snapshot کلاینت از attribute bootstrap خوانده شود؛ getSnapshot هر بار object تازه نسازد.
- meta theme-color یک نویسنده داشته باشد. media-based meta و override دستی متناقض تولید نشود؛ پس از آمادگی DOM و هر toggle، meta مدیریت‌شده همگام شود. نبود meta نباید bootstrap را متوقف کند.
- `components/layouts/SplashScreen/splashStyles.ts` رنگ literal برند دارد؛ اولین ورود و ورود تکراری QA شود. splash نباید flash سفید پس از پایان خود را پنهان کند.

در production مطابق CSP واقعی nonce یا hash تنظیم شود؛ برای حل این فیچر CSP عمومی ضعیف نشود و nonce سراسری با هزینهٔ dynamic بدون اندازه‌گیری اضافه نشود.

## ذخیره، چند تب و lifecycle

انتخاب در کوکی jayab_theme با `Path=/; Max-Age=31536000; SameSite=Lax` و Secure روی HTTPS ذخیره شود. شکست نوشتن کوکی crash ندهد، ولی UI ادعای ماندگاری نکند.

نوشتن کوکی رویداد storage تولید نمی‌کند. از BroadcastChannel با نام jayab-theme استفاده شود؛ در نبود آن sync هنگام focus/visibility با خواندن مجدد کوکی کافی است. tab دریافت‌کننده دوباره broadcast نکند. payload نامعتبر رد شود؛ apply از persist/broadcast جدا باشد. listenerها cleanup شوند و در StrictMode تکثیر نشوند.

setChoice فقط DOM، snapshot و persistence تم را عوض می‌کند؛ QueryClient و session remount نمی‌شوند. تغییر OS برای choice صریح بی‌اثر است. transition blanket روی تمام عناصر ممنوع؛ guard اختیاری کوتاه فقط propertyهای رنگ و pseudo-elementهای مربوط را پوشش دهد و با timer امن پاک شود.

## اتصال و پذیرش

- AppOverlays تم را به Toaster می‌دهد؛ toast.custom، skeleton، cropper، chart و logo جدا بررسی شوند.
- عکس آگهی و tile نقشه invert نشوند. adapter JS پس از mount رنگ resolve کند و با تغییر تم refresh شود.
- موتور خاموش با OS dark و کوکی dark هم روشن است؛ موتور فعال با کوکی معتبر پیش از paint نتیجهٔ درست دارد.
- reload هر سه choice، system با تغییر OS، کوکی نامعتبر، storage بسته و دو تب آزمایش شوند.
- hydration warning تازه، listener تکراری یا reset فلو رزرو رخ ندهد.
- JS خاموش fallback لایت قابل استفاده دارد. اولین paint با filmstrip و splash فعال/غیرفعال بررسی شود؛ screenshot پس از load اثبات نبود flash نیست.
- چک‌های فیچر ۱۰ و rollback با rebuild موتور خاموش ثبت شود.
