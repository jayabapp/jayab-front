import type { SpecOptionProps } from "@/types/components/modules/property-details";
import { ContentImage } from "@elements/Image";

const SpecOption = ({ title }: SpecOptionProps) => (
  <div className="flex items-center gap-1.5">
    <span className="w-4 rounded-full bg-brand-600 h-4 flex items-center justify-center">
      <ContentImage
        alt=""
        width={8}
        height={8}
        className="w-2 h-2"
        src="/assets/icons/adds/bright_tick.svg"
      />
    </span>
    <p>{title}</p>
  </div>
);

export default SpecOption;
