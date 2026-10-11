"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { useTheme } from "@hooks/useTheme";
import { useDir } from "@hooks/useDir";
import { useId } from "react";
import { Icon } from "@elements/Icon";

import type { PreferenceControlProps } from "@/types/components/modules/display-preferences";
import type { ThemeChoice } from "@/types/theme";
import type { IconName } from "@/types/components/elements/icon";

const OPTIONS: readonly ThemeChoice[] = ["light", "system", "dark"];
const ICONS: Record<ThemeChoice, IconName> = {
  light: "sun",
  system: "monitor",
  dark: "moon",
};

const ThemeSwitcher = ({ overHero = false }: PreferenceControlProps) => {
  const t = useTranslations("theme");
  const dir = useDir();
  const uid = useId();
  const { choice, ready, setChoice } = useTheme();
  const current = ready ? choice : "system";

  const options = (name: string, onHero: boolean, showLabels = false) => (
    <fieldset
      dir="ltr"
      disabled={!ready}
      className={`flex shrink-0 items-center rounded-full border p-0.5 ${
        onHero
          ? "border-white/60 bg-black/15 text-white backdrop-blur-sm"
          : "border-line bg-surface-muted text-ink-muted"
      }`}
    >
      <legend className="sr-only">{t("label")}</legend>
      {OPTIONS.map((value) => (
        <label key={value} className="relative flex-1 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={value}
            className="peer sr-only"
            checked={current === value}
            onChange={() => setChoice(value)}
          />
          <span
            title={t(value)}
            className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-full px-2 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-focus peer-disabled:cursor-wait ${
              current === value
                ? onHero
                  ? "bg-white/25 text-white shadow-sm"
                  : "bg-surface text-link shadow-sm"
                : onHero
                  ? "hover:bg-white/10"
                  : "hover:bg-selected hover:text-ink"
            } ${showLabels ? "rounded-xl py-2" : ""}`}
          >
            <Icon name={ICONS[value]} size={20} />
            <span className={showLabels ? "text-xs" : "sr-only"} dir={dir}>
              {t(value)}
            </span>
          </span>
        </label>
      ))}
    </fieldset>
  );

  return (
    <>
      <div className="hidden xl:block">
        {options(`${uid}-desktop`, overHero)}
      </div>
      <Popover className="relative xl:hidden">
        <PopoverButton
          aria-label={`${t("label")}: ${t(current)}`}
          title={`${t("label")}: ${t(current)}`}
          className={`flex size-11 items-center justify-center rounded-full border transition-colors ${
            overHero
              ? "border-white/60 bg-black/15 text-white backdrop-blur-sm hover:bg-white/20"
              : "border-line bg-surface text-ink-muted hover:bg-selected hover:text-ink"
          }`}
        >
          <Icon name={ICONS[current]} size={20} />
        </PopoverButton>
        <PopoverPanel
          focus
          dir={dir}
          anchor={{ to: "bottom start", gap: 8, padding: 12 }}
          className="z-[1100] w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-line bg-surface p-3 text-ink shadow-xl"
        >
          <p className="mb-2 text-sm font-medium">{t("label")}</p>
          {options(`${uid}-mobile`, false, true)}
        </PopoverPanel>
      </Popover>
    </>
  );
};

export default ThemeSwitcher;
