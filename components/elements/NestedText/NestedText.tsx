import type { NestedTextProps } from "@/types/components/elements/nested-text";
import type { FC } from "react";

import clsx from "clsx";

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
  dividerClassName = "border-neutral-400",
}) => {
  const formattedValue = formatValue(
    value,
    formatNumber,
    locale,
    maximumFractionDigits,
  );
  const formatTitle = (title: string) =>
    title.endsWith(":") ? title : `${title}:`;
  if (variant === "inline") {
    const dividerStyle =
      divider === "solid"
        ? "border-t border-neutral-300"
        : divider === "dashed"
          ? "border-t border-dashed border-neutral-300"
          : "";

    return (
      <div
        className={clsx(
          "flex flex-wrap items-center gap-1",
          alignClassMap[align],
          containerClassName,
        )}
      >
        <div className={titleIconContainerClassName}>
          {Icon && <span className="shrink-0">{Icon}</span>}
          <span className={titleClassName}>{formatTitle(title)}</span>
        </div>

        {divider !== "none" && (
          <span
            className={clsx(dividerStyle, dividerClassName, "flex-1 mx-1")}
          />
        )}

        <div className={valueUnitContainerClassName}>
          <bdi className={valueClassName}>{formattedValue}</bdi>
          {unit && <span className={unitClassName}>{unit}</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex flex-col gap-1",
        alignClassMap[align],
        containerClassName,
      )}
    >
      <div className={titleIconContainerClassName}>
        {Icon && <span className="shrink-0">{Icon}</span>}
        <span className={titleClassName}>{formatTitle(title)}</span>
      </div>

      <div className={valueUnitContainerClassName}>
        <bdi className={valueClassName}>{formattedValue}</bdi>
        {unit && <span className={unitClassName}>{unit}</span>}
      </div>
    </div>
  );
};

export default NestedText;
