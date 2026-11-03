import { useTranslations } from "next-intl";

// ", " in English, the Arabic comma in fa/ar. Joins place names and summaries.
export const useListSeparator = () => useTranslations("common")("separator");
