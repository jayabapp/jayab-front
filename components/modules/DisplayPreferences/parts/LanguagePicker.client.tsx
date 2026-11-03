"use client";

import { isLocaleSwitchLocked, SEGMENT_CLASS, segmentOptionClass } from "../config";
import { enabledLocales, localeMeta, dirOf } from "@/i18n/config";
import { useLocaleSwitch } from "@hooks/useLocaleSwitch";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { notify } from "@elements/Toast";
import { useId } from "react";

import type { PreferenceSectionProps } from "@/types/components/modules/display-preferences";

const LanguagePicker = ({ large = false }: PreferenceSectionProps) => {
  const t = useTranslations();
  const labelId = useId();
  const reasonId = useId();
  const pathname = usePathname();
  const disabled = isLocaleSwitchLocked(pathname);
  const { locale, setLocale } = useLocaleSwitch(!disabled);

  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-col gap-2">
      <p id={labelId} className="text-xs font-semibold text-ink-subtle">
        {t("language.label")}
      </p>
      <div className={SEGMENT_CLASS}>
        {enabledLocales.map((value) => (
          <button
            key={value}
            type="button"
            disabled={disabled}
            dir={dirOf(value)}
            lang={localeMeta[value].lang}
            aria-pressed={locale === value}
            aria-describedby={disabled ? reasonId : undefined}
            onClick={() => {
              if (!setLocale(value))
                void notify({ type: "error", body: t("errors.preferenceNotSaved") });
            }}
            className={`${segmentOptionClass(locale === value, large)} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {localeMeta[value].name}
          </button>
        ))}
      </div>
      {disabled ? (
        <p id={reasonId} className="text-xs text-ink-muted">
          {t("language.switchBlocked")}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default LanguagePicker;
