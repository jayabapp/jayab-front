# فیچر ۰۱ — توکن‌های رنگ سازگار با new-app

مبنا: `feat/new-app@c8e26fff` · پیش‌نیاز: [ممیزی](00-branch-audit.md) · خروجی: زیرساخت رنگ و مهاجرت تدریجی.

## وضعیت واقعی

`theme/colors.ts` پالت `canvas/brand/neutral/success/warning/danger` را دارد و `tailwind.config.ts` همان را import می‌کند. features و utils در content هستند. `darkMode: "class"` و استفادهٔ dark variant فعلی وجود ندارند. `styles/globals.css` از `theme("colors.neutral.900")` و `theme("colors.canvas")` استفاده می‌کند، ولی body و برخی اجزا هنوز سفید ثابت‌اند. bg-white در مبنا ۱۸۲ occurrence در ۱۳۲ فایل دارد؛ این تعداد، شمار کار قابل‌جایگزینی خودکار نیست.

مصرف پالت فقط Tailwind نیست: `components/elements/Map/map-colors.ts` و `components/layouts/SplashScreen/splashStyles.ts` رنگ را به JS می‌برند. تبدیل کل colors به CSS variable می‌تواند SDK نقشه را بشکند.

## قرارداد طراحی

سه لایه داشته باشیم:

1. **Primitive:** theme/colors.ts با مقادیر موجود و ثابت؛ مناسب برند، لوگو و SDK نیازمند رنگ literal. palette در دارک وارونه نمی‌شود.
2. **Semantic:** متغیرهای `--c-*` در `styles/theme-tokens.css`، import از globals.css؛ light بر مبنای برنچ و dark پیشنهادی. [starter](starter/tokens.css) مرجع شروع است.
3. **مصرف:** کلاس‌هایی مثل bg-surface، text-ink، border-line و bg-action text-on-action؛ تغییر رنگ بدون variant جداگانه.

export جدید `semanticColors` در `theme/semantic-colors.ts` بسازید و در Tailwind با پالت موجود merge کنید. کلیدهای brand، neutral، success، warning و danger حفظ شوند؛ alias معنایی همنام با این objectها ساخته نشود.

```ts
// theme/semantic-colors.ts؛ نمونهٔ نگاشت، نه کد داخل کامپوننت
export const semanticColors = {
  surface: "rgb(var(--c-surface) / <alpha-value>)",
  "surface-muted": "rgb(var(--c-surface-muted) / <alpha-value>)",
  ink: "rgb(var(--c-ink) / <alpha-value>)",
  "ink-muted": "rgb(var(--c-ink-muted) / <alpha-value>)",
  line: "rgb(var(--c-line) / <alpha-value>)",
  action: "rgb(var(--c-action) / <alpha-value>)",
  "on-action": "rgb(var(--c-on-action) / <alpha-value>)",
};
```

در config: `colors: { ...colors, ...semanticColors }`. کلید canvas فعلی حفظ شود؛ bg-page توکن جدید سطح صفحه است. سپس body، app-background و اجزای مهاجرت‌شده صریحاً به page وصل شوند. تغییر global border و shadow در PR بصری جدا انجام شود؛ افزودن توکن نباید خودبه‌خود همهٔ رنگ‌های فعلی را تغییر دهد.

| نقش | کلاس پیشنهادی | light | توضیح |
| --- | --- | --- | --- |
| صفحهٔ عمومی | bg-page | #F8FBFF | برابر canvas برنچ؛ body فعلی سفید است، تغییر آن screenshot می‌خواهد |
| کارت/مودال | bg-surface | #FFFFFF | سفید فعلی حفظ می‌شود |
| سطح ملایم | bg-surface-muted | #F3F4F6 | neutral.100 |
| متن اصلی/ثانویه | text-ink / text-ink-muted | neutral.900 / neutral.600 | کنتراست روی سطح واقعی سنجیده شود |
| لینک/دکمه | text-link / bg-action text-on-action | brand.600 / brand.600 + سفید | brand.500 با سفید برای متن کوچک کافی فرض نشود |
| خط تزئینی/لبهٔ کارت/مرز کنترل | border-line / border-line-strong / border-control | neutral.200 / neutral.300 / neutral.500 | تزئین و مرز ضروری کنترل یکسان نیستند. line روی سفید فقط ۱٫۲۴:۱ است و برای جداکننده کافی است، نه لبهٔ کارت؛ لبهٔ کارت، panel و badge از line-strong (۱٫۴۷:۱ لایت، ۲٫۱۶:۱ دارک) استفاده می‌کند |
| وضعیت | text-status-danger/success/warning | danger.600 / success.600 / warning.600 | background (`-bg`) و لبهٔ (`-line`) متناظر جدا دارد |
| دکمهٔ اصلی در دارک | bg-action text-on-action | brand.500 + neutral.900 | سفید روی brand.600 در دارک فقط ۳٫۲:۱ نسبت به سطح بود و hover تیره‌تر ۲٫۳:۱ می‌شد؛ در دارک hover روشن‌تر (brand.400) است |

مقادیر dark و hover روی جفت‌های واقعی متن/زمینه سنجیده شوند. ۱۶px bold خودبه‌خود «متن بزرگ» محسوب نمی‌شود؛ هدف متن عادی ۴٫۵:۱، focus و مرز ضروری کنترل ۳:۱ است. disabled استثنای معیار است، ولی باید قابل تشخیص بماند.

## مراحل و فایل‌ها

**وضعیت:** گام ۱ انجام شد (`styles/theme-tokens.css`، `theme/semantic-colors.ts`، merge در `tailwind.config.ts`، import در `globals.css`). هنوز هیچ کامپوننتی توکن را مصرف نمی‌کند و `data-theme="dark"` را کسی تنظیم نمی‌کند، پس ظاهر اپ تغییری نکرده است. گام ۲ به بعد (مهاجرت صفحه‌ها) در PRهای جدا.

1. افزودن styles/theme-tokens.css و export معنایی بدون حذف پالت قبلی. اگر variant دارک برای asset خاص لازم شد، selector Tailwind به data-theme وصل شود؛ دارک خودکار media منبع دوم تم نباشد.
2. مهاجرت SiteHeader، SiteFooter، AppOverlays، فرم و مودال. text-white روی تصویر یا دکمه رنگی ممکن است درست باشد؛ حذف کورکورانه ممنوع.
3. PropertyDetails، PropertyGallery، PropertyBooking، PropertyContact، فهرست و فیلترها؛ سپس سایر گروه‌های فیچر ۱۰.
4. رنگ style در DOM با `rgb(var(--c-...))` مصرف شود، نه RGB triplet خالی. برای Recharts پشتیبانی CSS color بررسی شود. SDK فاقد پشتیبانی variable با adapter رنگ literal و update روی تغییر تم متصل شود.
5. AppOverlays به Toaster تم می‌دهد، ولی `components/elements/Toast/Toast.tsx` خروجی toast.custom دارد؛ رنگ markup آن جدا مهاجرت شود.
6. logo، عکس آگهی، Lottie و tile نقشه فیلتر عمومی invert نمی‌گیرند. اگر سبک تیرهٔ SDK موجود نبود، نقشهٔ روشن در قاب خوانا باقی می‌ماند.

## پذیرش، ریسک و برگشت

- کلیدها و مقادیر primitive ثابت‌اند؛ Map/Splash همچنان رنگ معتبر می‌گیرند.
- modifier مثل bg-surface/80 در CSS کامپایل‌شده درست است.
- فایل‌های مهاجرت‌شده رنگ UI ثابت ندارند؛ استثناهای asset/brand با دلیل و مسیر ثبت شوند. neutral-* در کد مهاجرت‌نکرده شکست CI نیست.
- screenshot لایت برای تغییر مکانیکی برابر است؛ تفاوت طراحی body، دکمه و shadow در PR مشخص شود. دارک متن نامرئی یا سطح ناخواسته نداشته باشد.
- contrast با بررسی حفظ‌شونده کنترل شود؛ اسکریپت پس از اجرا حذف نشود. verify-starter علاوه بر متن، خود کنترل action و hover (۳:۱)، line-strong، ink-subtle و متن وضعیت روی هر سه سطح را می‌سنجد.
- رنگ خام Tailwind (`red-*`, `green-*`, `emerald-*`, `amber-*` و مشابه) هم باید به توکن وضعیت مهاجرت کند؛ audit-branch آن را با `rawPaletteColor` می‌شمارد (۴۷ مورد در ۲۷ فایل در baseline).
- چک‌های فیچر ۱۰ پاس شوند. هر دسته با revert PR و موتور تم خاموش قابل بازگشت باشد.
