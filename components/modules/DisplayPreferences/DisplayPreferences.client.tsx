"use client";

import { DISPLAY_PREFERENCES_VISIBLE, SHOW_LOCALE_CONTROL } from "./config";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { localeMeta, resolveLocale } from "@/i18n/config";
import { useLocale, useTranslations } from "next-intl";
import { ModalBottomSheet } from "@elements/Modal";
import { SHOW_THEME_CONTROL } from "./config";
import { useState } from "react";
import { Icon } from "@elements/Icon";
import { useDir } from "@hooks/useDir";

import type { DisplayPreferencesProps } from "@/types/components/modules/display-preferences";

import LanguagePicker from "./parts/LanguagePicker.client";
import ThemeSwitcher from "./parts/ThemeSwitcher.client";

const DisplayPreferences = ({
  overHero = false,
  className = "",
}: DisplayPreferencesProps) => {
  const t = useTranslations();
  const dir = useDir();
  const locale = resolveLocale(useLocale());
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!DISPLAY_PREFERENCES_VISIBLE) return null;

  const title = t("header.displayPreferences");
  const label = SHOW_LOCALE_CONTROL
    ? `${title}: ${localeMeta[locale].name}`
    : title;
  const icon = SHOW_LOCALE_CONTROL ? "globe" : "sun";
  const shellClass = overHero
    ? "border-white/60 bg-black/15 text-white backdrop-blur-sm hover:bg-white/20"
    : "border-line bg-surface text-ink-muted hover:bg-selected hover:text-ink";

  const sections = (large: boolean) => (
    <>
      {SHOW_LOCALE_CONTROL ? <LanguagePicker large={large} /> : <></>}
      {SHOW_THEME_CONTROL ? <ThemeSwitcher large={large} /> : <></>}
    </>
  );

  return (
    <div className={`flex shrink-0 items-center ${className}`}>
      <Popover className="relative hidden xl:block">
        <PopoverButton
          title={label}
          aria-label={label}
          className={`flex h-10 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors ${shellClass}`}
        >
          <Icon name={icon} size={20} />
          {SHOW_LOCALE_CONTROL ? (
            <span lang={localeMeta[locale].lang}>
              {localeMeta[locale].name}
            </span>
          ) : (
            <></>
          )}
        </PopoverButton>
        <PopoverPanel
          focus
          dir={dir}
          anchor={{ to: "bottom start", gap: 8, padding: 12 }}
          className="z-[1100] flex w-80 max-w-[calc(100vw-1.5rem)] flex-col gap-4 rounded-20 border border-line bg-surface p-4 text-ink shadow-elevated"
        >
          {sections(false)}
        </PopoverPanel>
      </Popover>

      <button
        type="button"
        title={label}
        aria-label={label}
        onClick={() => setSheetOpen(true)}
        className={`flex size-11 items-center justify-center rounded-full border transition-colors xl:hidden ${shellClass}`}
      >
        <Icon name={icon} size={20} />
      </button>
      <ModalBottomSheet show={sheetOpen} onHide={() => setSheetOpen(false)}>
        <div dir={dir} className="flex flex-col gap-5 px-4 pb-2 text-ink">
          <div className="flex items-center justify-between">
            <p className="text-base font-bold">{title}</p>
            <button
              type="button"
              aria-label={t("common.close")}
              onClick={() => setSheetOpen(false)}
              className="-me-2 flex size-11 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink"
            >
              <Icon name="x" size={20} />
            </button>
          </div>
          {sections(true)}
        </div>
      </ModalBottomSheet>
    </div>
  );
};

export default DisplayPreferences;
