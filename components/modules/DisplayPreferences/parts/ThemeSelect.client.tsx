"use client";

import { useTranslations } from "next-intl";
import { THEME_CHOICES } from "@lib/theme/config";
import { useTheme } from "@hooks/useTheme";

import type { ThemeSelectProps } from "@/types/components/modules/display-preferences";
import type { ThemeChoice } from "@/types/theme";

import PreferenceSelect from "./PreferenceSelect";

const ThemeSelect = ({ id }: ThemeSelectProps) => {
  const t = useTranslations("theme");
  const { choice, setChoice } = useTheme();
  return (
    <PreferenceSelect<ThemeChoice>
      id={id}
      value={choice}
      label={t("label")}
      onChange={setChoice}
      options={THEME_CHOICES.map((value) => ({ value, label: t(value) }))}
    />
  );
};

export default ThemeSelect;
