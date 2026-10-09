import type { PreferenceSelectProps } from "@/types/components/modules/display-preferences";

const PreferenceSelect = <T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  disabled,
  describedBy,
}: PreferenceSelectProps<T>) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-medium text-ink-muted">
      {label}
    </label>
    <select
      id={id}
      value={value}
      disabled={disabled}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value as T)}
      className="h-11 w-full cursor-pointer rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-subtle"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} lang={option.lang}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default PreferenceSelect;
