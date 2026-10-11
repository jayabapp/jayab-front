"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { enabledLocales, localeMeta, dirOf } from "@/i18n/config";
import { isLocaleSwitchLocked } from "../config";
import { useLocaleSwitch } from "@hooks/useLocaleSwitch";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { notify } from "@elements/Toast";
import { useDir } from "@hooks/useDir";
import { useId } from "react";
import { Icon } from "@elements/Icon";

import type { PreferenceControlProps } from "@/types/components/modules/display-preferences";

const LanguagePicker = ({ overHero = false }: PreferenceControlProps) => {
  const t = useTranslations();
  const dir = useDir();
  const reasonId = useId();
  const pathname = usePathname();
  const disabled = isLocaleSwitchLocked(pathname);
  const { locale, setLocale } = useLocaleSwitch(!disabled);
  const currentLabel = t("language.current", { name: localeMeta[locale].name });

  return (
    <Popover className="relative">
      <PopoverButton
        aria-label={currentLabel}
        title={currentLabel}
        className={`flex size-11 items-center justify-center rounded-full border transition-colors ${
          overHero
            ? "border-white/60 bg-black/15 text-white backdrop-blur-sm hover:bg-white/20"
            : "border-line bg-surface text-ink-muted hover:bg-selected hover:text-ink"
        }`}
      >
        <Icon name="globe" size={20} />
      </PopoverButton>
      <PopoverPanel
        focus
        dir={dir}
        anchor={{ to: "bottom start", gap: 8, padding: 12 }}
        className="z-[1100] w-56 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-line bg-surface p-2 text-ink shadow-xl"
      >
        <p className="px-3 py-2 text-xs font-medium text-ink-muted">
          {t("language.label")}
        </p>
        <div className="flex flex-col gap-1">
          {enabledLocales.map((value) => (
            <button
              key={value}
              type="button"
              disabled={disabled}
              aria-current={locale === value ? "true" : undefined}
              aria-describedby={disabled ? reasonId : undefined}
              onClick={() => {
                if (!setLocale(value))
                  void notify({ type: "error", body: t("errors.preferenceNotSaved") });
              }}
              className={`flex min-h-11 w-full items-center justify-between gap-4 rounded-xl px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                locale === value
                  ? "bg-selected text-link"
                  : "hover:bg-surface-muted"
              }`}
            >
              <span lang={localeMeta[value].lang} dir={dirOf(value)}>
                {localeMeta[value].name}
              </span>
              {locale === value ? <Icon name="check" size={20} /> : null}
            </button>
          ))}
        </div>
        {disabled ? (
          <p id={reasonId} className="px-3 pt-2 text-xs text-ink-muted">
            {t("language.switchBlocked")}
          </p>
        ) : null}
      </PopoverPanel>
    </Popover>
  );
};

export default LanguagePicker;
