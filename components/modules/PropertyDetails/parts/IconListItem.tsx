import type { IconListItemProps } from "@/types/components/modules/property-details";

import { ContentImage } from "@elements/Image";
import { Icon } from "@elements/Icon";

const IconListItem = ({ image, label, state = "on" }: IconListItemProps) => (
  <div
    className={`flex items-center gap-2.5 ${
      state === "off" ? "text-neutral-400 line-through" : "text-neutral-800"
    }`}
  >
    {image ? (
      <ContentImage
        alt=""
        width={20}
        height={20}
        src={image}
        className="size-5 shrink-0 object-contain"
      />
    ) : (
      <Icon name="check" size={20} />
    )}
    <p className="text-sm">{label}</p>
  </div>
);

export default IconListItem;
