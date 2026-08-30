import type { ShareChannelRowProps } from "@/types/components/modules/property-contact";
import { ContentImage } from "@elements/Image";
import { Checkbox } from "@elements/Form";

const ShareChannelRow = ({ cb, data, isChecked }: ShareChannelRowProps) => (
  <div className="flex cursor-pointer items-center justify-between w-full">
    <Checkbox
      onSelect={cb}
      isChecked={isChecked}
      containerClass="w-full"
      titleClass="flex-1"
      title={
        <span className="flex items-center gap-2">
          <ContentImage alt="" width={16} height={16} className="w-4 h-4" src={data?.icon || ""} />
          <span className="text-xs md:text-sm">{data?.title}</span>
        </span>
      }
    />
  </div>
);

export default ShareChannelRow;
