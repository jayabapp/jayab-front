"use client";

import { DISPLAY_PREFERENCES_VISIBLE, SHOW_LOCALE_CONTROL } from "./config";
import { SHOW_THEME_CONTROL } from "./config";

import type { DisplayPreferencesProps } from "@/types/components/modules/display-preferences";

import LanguagePicker from "./parts/LanguagePicker.client";
import ThemeSwitcher from "./parts/ThemeSwitcher.client";

const DisplayPreferences = ({
  overHero = false,
  className = "",
}: DisplayPreferencesProps) => {
  if (!DISPLAY_PREFERENCES_VISIBLE) return null;

  return (
    <div dir="rtl" className={`flex shrink-0 items-center gap-1 ${className}`}>
      {SHOW_LOCALE_CONTROL ? <LanguagePicker overHero={overHero} /> : null}
      {SHOW_THEME_CONTROL ? <ThemeSwitcher overHero={overHero} /> : null}
    </div>
  );
};

export default DisplayPreferences;
