"use client";

import { enabledLocales, localeMeta } from "@/i18n/config";
import { useLocaleSwitch } from "@hooks/useLocaleSwitch";
import { useTranslations } from "next-intl";
import { notify } from "@elements/Toast";

import type { LocaleSelectProps } from "@/types/components/modules/display-preferences";
import type { Locale } from "@/i18n/config";

import PreferenceSelect from "./PreferenceSelect";

const LocaleSelect = ({ id, disabled, reasonId }: LocaleSelectProps) => {
  const t = useTranslations();
  const { locale, setLocale } = useLocaleSwitch(!disabled);

  const onChange = (next: Locale) => {
    if (!setLocale(next))
      void notify({ type: "error", body: t("errors.preferenceNotSaved") });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <PreferenceSelect<Locale>
        id={id}
        value={locale}
        disabled={disabled}
        onChange={onChange}
        label={t("language.label")}
        describedBy={disabled ? reasonId : undefined}
        options={enabledLocales.map((value) => ({
          value,
          lang: localeMeta[value].lang,
          label: localeMeta[value].name,
        }))}
      />
      {disabled ? (
        <p id={reasonId} className="text-xs text-ink-muted">
          {t("language.switchBlocked")}
        </p>
      ) : null}
    </div>
  );
};

export default LocaleSelect;
