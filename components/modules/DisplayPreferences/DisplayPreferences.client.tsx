"use client";

import { DISPLAY_PREFERENCES_VISIBLE, SHOW_LOCALE_CONTROL } from "./config";
import { SHOW_THEME_CONTROL, isLocaleSwitchLocked } from "./config";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useId } from "react";

import type { DisplayPreferencesProps } from "@/types/components/modules/display-preferences";

import LocaleSelect from "./parts/LocaleSelect.client";
import ThemeSelect from "./parts/ThemeSelect.client";

const DisplayPreferences = ({
  overHero = false,
  className = "",
}: DisplayPreferencesProps) => {
  const t = useTranslations("header");
  const pathname = usePathname();
  const uid = useId();

  if (!DISPLAY_PREFERENCES_VISIBLE) return null;

  return (
    <Popover className={`relative shrink-0 ${className}`}>
      <PopoverButton
        aria-label={t("displayPreferences")}
        className="flex size-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
      >
        <span
          className={`flex size-9 items-center justify-center rounded-full border transition-all ${
            overHero
              ? "border-white/60 bg-surface/35 text-white backdrop-blur-[2px]"
              : "border-selected-line bg-selected text-ink-muted"
          }`}
        >
          <svg
            aria-hidden="true"
            className="size-[1.125rem]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
            <circle cx="15" cy="7" r="2" />
            <circle cx="9" cy="17" r="2" />
          </svg>
        </span>
      </PopoverButton>

      <PopoverPanel
        aria-label={t("displayPreferences")}
        anchor={{ to: "bottom end", gap: 8, padding: 8 }}
        className="z-[1100] flex w-72 max-w-[calc(100vw-1rem)] flex-col gap-4 rounded-xl border border-line bg-surface p-4 text-ink shadow-xl"
      >
        {SHOW_THEME_CONTROL ? <ThemeSelect id={`${uid}-theme`} /> : null}
        {SHOW_LOCALE_CONTROL ? (
          <LocaleSelect
            id={`${uid}-locale`}
            reasonId={`${uid}-locale-reason`}
            disabled={isLocaleSwitchLocked(pathname)}
          />
        ) : null}
      </PopoverPanel>
    </Popover>
  );
};

export default DisplayPreferences;
