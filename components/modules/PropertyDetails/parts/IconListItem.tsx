
import { ContentImage } from "@elements/Image";
import { Icon } from "@elements/Icon";

import type { IconListItemProps } from "@/types/components/modules/property-details";

const IconListItem = ({
  image,
  label,
  labelLang,
  state = "on",
  icon = "sparkles",
}: IconListItemProps) => (
  <div
    className={`flex items-center gap-2.5 ${
      state === "off" ? "text-ink-subtle line-through" : "text-ink"
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
      <Icon name={icon} size={20} className="text-ink-muted" />
    )}
    <p className="text-sm" lang={labelLang}>
      <bdi>{label}</bdi>
    </p>
  </div>
);

export default IconListItem;
