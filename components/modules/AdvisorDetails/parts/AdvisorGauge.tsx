import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import type { AdvisorGaugeProps } from "@/types/components/modules/advisors";

import "react-circular-progressbar/dist/styles.css";

const AdvisorGauge = ({
  label,
  title,
  value,
  pathColor,
  textColor,
  textSize,
  labelClass,
  titleClass,
  containerClass,
}: AdvisorGaugeProps) => (
  <div className="w-full flex items-center gap-1 md:gap-2">
    {label ? (
      <p className={`text-xxs shrink-0 md:text-sm ${labelClass ?? ""}`}>
        {label} :
      </p>
    ) : null}
    <div className={`${containerClass ?? ""} flex items-center gap-4 flex-col`}>
      <CircularProgressbar
        value={value}
        strokeWidth={10}
        text={`${value}`}
        className="max-w-20 md:p-2 !pr-0"
        styles={buildStyles({ pathColor, textColor, textSize })}
      />
      {title ? (
        <p className={`text-xxs shrink-0 md:text-sm w-fit ${titleClass ?? ""}`}>
          {title}
        </p>
      ) : null}
    </div>
  </div>
);

export default AdvisorGauge;
