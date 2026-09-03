const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export const normalizePersianSearchText = (value: string) =>
  value
    .normalize("NFKC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    // Must stay identical to the backend's normalizePersianSearchText: this text
    // becomes the React Query key, and a term the two sides normalize differently
    // caches under one key while the server answers about another.
    //
    // ZWNJ sits *inside* a Persian word, so it is removed rather than turned into
    // a space \u2014 mapping it to a space split "\u0627\u0642\u0627\u0645\u062a\u200c\u06af\u0627\u0647" into two words and turned
    // "\u06f1\u0662\u200c\u06f3" into "12 3".
    .replace(/[\u200c\u200d\u200e\u200f]/g, "")
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
    .replace(/\s+/g, " ")
    .trim();
