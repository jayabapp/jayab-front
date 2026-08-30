import type { SpecRowProps } from "@/types/components/modules/property-details";

const SpecRow = ({ dots, options, title, unit, value }: SpecRowProps) => (
  <div className="flex items-center gap-4 justify-between w-full">
    <p
      className={`text-sm font-medium ${options?.title_class ?? ""} ${dots ? "shrink-0" : ""}`}
    >
      {title}
    </p>
    {dots ? <div className="w-full h-[1px] border-t border-dashed" /> : null}
    <p
      className={`font-semibold ${options?.value_class ?? ""} ${dots ? "shrink-0" : ""}`}
    >
      {value} <span className="font-medium">{unit}</span>
    </p>
  </div>
);

export default SpecRow;
