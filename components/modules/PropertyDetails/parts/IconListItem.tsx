import { StaticIcon } from "@elements/StaticIcon";
import { Icon } from "@elements/Icon";

import type { IconListItemProps } from "@/types/components/modules/property-details";

const IconListItem = ({
  label,
  labelLang,
  state = "on",
  staticIcon,
  icon = "sparkles",
}: IconListItemProps) => (
  <div
    className={`flex items-center gap-2.5 ${
      state === "off" ? "text-ink-subtle line-through" : "text-ink"
    }`}
  >
    {staticIcon ? (
      <StaticIcon icon={staticIcon} size={20} />
    ) : (
      <Icon name={icon} size={20} className="text-ink-muted" />
    )}
    <p className="text-sm" lang={labelLang}>
      <bdi>{label}</bdi>
    </p>
  </div>
);

export default IconListItem;
