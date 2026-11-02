import type { StaticIconProps } from "@/types/components/elements/static-icon";
import type { CSSProperties } from "react";

const VARIANT = {
  "card-icons": ["primary", "accent"],
  default: ["day", "night"],
} as const;

const SIZE_CLASS = {
  16: "size-4",
  20: "size-5",
  24: "size-6",
  32: "size-8",
  56: "size-14",
  64: "size-16",
} as const;

const StaticIcon = ({ icon, size, className = "" }: StaticIconProps) => {
  const [light, dark] =
    VARIANT[icon.set === "card-icons" ? "card-icons" : "default"];
  const file = (variant: string) =>
    `url(/assets/${icon.set}/icon-${icon.n}-${variant}.svg)`;

  return (
    <span
      aria-hidden="true"
      className={`static-icon shrink-0 ${size ? SIZE_CLASS[size] : ""} ${className}`}
      style={
        {
          "--icon-light": file(light),
          "--icon-dark": file(dark),
        } as CSSProperties
      }
    />
  );
};

export default StaticIcon;
