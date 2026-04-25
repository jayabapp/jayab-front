import clsx from "clsx";
import { FC, ReactNode } from "react";

type NestedTextProps = {
  title: string;
  value?: number | string;
  unit?: string;
  Icon?: ReactNode;

  variant?: "inline" | "stacked";
  align?: "start" | "center" | "end";

  formatNumber?: boolean;
  locale?: "fa" | "en";
  maximumFractionDigits?: number;

  titleClassName?: string;
  valueClassName?: string;
  unitClassName?: string;
  containerClassName?: string;
  titleIconContainerClassName?: string;
  valueUnitContainerClassName?: string;

  divider?: "none" | "solid" | "dashed";
  dividerClassName?: string;
};

const formatValue = (
  value: string | number | undefined,
  formatNumber?: boolean,
  locale?: "fa" | "en",
  maximumFractionDigits?: number,
) => {
  if (value === undefined) return "-";
  if (!formatNumber || typeof value !== "number") return value;

  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    maximumFractionDigits,
  }).format(value);
};

const alignClassMap = {
  start: "items-start text-right",
  center: "items-center text-center",
  end: "items-end text-left",
};

const NestedText: FC<NestedTextProps> = ({
  title,
  value,
  unit,
  Icon,
  variant = "inline",
  align = "center",
  formatNumber = false,
  locale = "fa",
  maximumFractionDigits,
  titleClassName = "text-14 md:text-16",
  valueClassName = "text-14 md:text-16 font-bold text-secondary-500 text-right whitespace-pre-line",
  unitClassName = "text-14 md:text-16 font-bold text-secondary-500",
  containerClassName = "",
  titleIconContainerClassName = "flex flex-row items-center gap-1",
  valueUnitContainerClassName = "flex flex-row items-center gap-1",
  divider = "none",
  dividerClassName = "border-gray-400",
}) => {
  const formattedValue = formatValue(value, formatNumber, locale, maximumFractionDigits);
  const formatTitle = (title: string) => (title.endsWith(":") ? title : `${title}:`);
  /* ---------- Inline Variant ---------- */
  if (variant === "inline") {
    const dividerStyle =
      divider === "solid"
        ? "border-t border-gray-300"
        : divider === "dashed"
          ? "border-t border-dashed border-gray-300"
          : "";

    return (
      <div className={clsx("flex flex-wrap items-center gap-1", alignClassMap[align], containerClassName)}>
        {/* Title and Icon */}
        <div className={titleIconContainerClassName}>
          {Icon && <span className="shrink-0">{Icon}</span>}
          <span className={titleClassName}>{formatTitle(title)}</span>
        </div>

        {/* Divider (inline only) */}
        {divider !== "none" && <span className={clsx(dividerStyle, dividerClassName, "flex-1 mx-1")} />}

        {/* Value and Unit */}
        <div className={valueUnitContainerClassName}>
          <bdi className={valueClassName}>{formattedValue}</bdi>
          {unit && <span className={unitClassName}>{unit}</span>}
        </div>
      </div>
    );
  }

  /* ---------- Stacked Variant ---------- */
  return (
    <div className={clsx("flex flex-col gap-1", alignClassMap[align], containerClassName)}>
      {/* Title and Icon */}
      <div className={titleIconContainerClassName}>
        {Icon && <span className="shrink-0">{Icon}</span>}
        <span className={titleClassName}>{formatTitle(title)}</span>
      </div>

      {/* Value and Unit */}
      <div className={valueUnitContainerClassName}>
        <bdi className={valueClassName}>{formattedValue}</bdi>
        {unit && <span className={unitClassName}>{unit}</span>}
      </div>
    </div>
  );
};

export default NestedText;
