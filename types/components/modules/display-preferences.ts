export type DisplayPreferencesProps = {
  overHero?: boolean;
  className?: string;
};

export type PreferenceSelectOption<T extends string> = {
  value: T;
  label: string;
  lang?: string;
};

export type PreferenceSelectProps<T extends string> = {
  id: string;
  label: string;
  value: T;
  options: readonly PreferenceSelectOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  describedBy?: string;
};

export type LocaleSelectProps = {
  id: string;
  disabled: boolean;
  reasonId: string;
};

export type ThemeSelectProps = {
  id: string;
};
