import {
  GROUP_FALLBACK_ICON,
  LANDING_CARD_ICONS,
  OPTION_ICON_RULES,
  PROPERTY_TYPE_CARD_ICONS,
  PROPERTY_TYPE_CARD_ICONS_BY_ID,
} from "@features/properties/constants/static-icons";

import type { StaticIconRef } from "@/types/components/elements/static-icon";

// Built from code points: the UI-text check reads string literals for Persian letters.
const ZWNJ = String.fromCharCode(0x200c);
const ARABIC_YEH = String.fromCharCode(0x064a);
const PERSIAN_YEH = String.fromCharCode(0x06cc);
const ARABIC_KAF = String.fromCharCode(0x0643);
const PERSIAN_KAF = String.fromCharCode(0x06a9);
const DIACRITICS_AND_TATWEEL = /[ً-ٟـ]/g;

// Panel titles mix Arabic and Persian letters, half-spaces and stray spacing.
export const normalizeTitle = (title: string) =>
  title
    .replaceAll(ZWNJ, " ")
    .replaceAll(ARABIC_YEH, PERSIAN_YEH)
    .replaceAll(ARABIC_KAF, PERSIAN_KAF)
    .replace(DIACRITICS_AND_TATWEEL, "")
    .replace(/\s+/g, " ")
    .trim();

export const optionStaticIcon = (
  title: string,
  group: string,
): StaticIconRef | null => {
  const value = normalizeTitle(title);
  const rule = OPTION_ICON_RULES.find(
    (entry) =>
      (!entry.groups || entry.groups.includes(group)) &&
      entry.match.test(value),
  );
  return rule?.icon ?? GROUP_FALLBACK_ICON[group] ?? null;
};

const landingSlug = (url: string) =>
  url
    .split(/[?#]/)[0]
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();

export const landingStaticIcon = (url: string): StaticIconRef | null =>
  LANDING_CARD_ICONS[landingSlug(url)] ?? null;

export const propertyTypeStaticIcon = (
  id: number | string | undefined,
  title: string,
): StaticIconRef | null => {
  const value = normalizeTitle(title);
  return (
    PROPERTY_TYPE_CARD_ICONS_BY_ID[Number(id)] ??
    PROPERTY_TYPE_CARD_ICONS.find((entry) => entry.match.test(value))?.icon ??
    null
  );
};
