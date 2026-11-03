"use client";

import { SEGMENT_CLASS, segmentOptionClass } from "../config";
import { useTranslations } from "next-intl";
import { useTheme } from "@hooks/useTheme";
import { useId } from "react";
import { Icon } from "@elements/Icon";

import type { PreferenceSectionProps } from "@/types/components/modules/display-preferences";
import type { IconName } from "@/types/components/elements/icon";
import type { ThemeChoice } from "@/types/theme";

const OPTIONS: readonly ThemeChoice[] = ["light", "system", "dark"];
const ICONS: Record<ThemeChoice, IconName> = {
  light: "sun",
  system: "monitor",
  dark: "moon",
};

const ThemeSwitcher = ({ large = false }: PreferenceSectionProps) => {
  const t = useTranslations("theme");
  const name = useId();
  const { choice, ready, setChoice } = useTheme();
  const current = ready ? choice : "system";

  return (
    <fieldset disabled={!ready}>
      <legend className="mb-2 text-xs font-semibold text-ink-subtle">
        {t("label")}
      </legend>
      <div className={SEGMENT_CLASS}>
        {OPTIONS.map((value) => (
          <label key={value} className="relative min-w-0 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={value}
              className="peer sr-only"
              checked={current === value}
              onChange={() => setChoice(value)}
            />
            <span
              className={`${segmentOptionClass(current === value, large)} peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-focus peer-disabled:cursor-wait`}
            >
              <Icon name={ICONS[value]} size={16} />
              {t(value)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export default ThemeSwitcher;
