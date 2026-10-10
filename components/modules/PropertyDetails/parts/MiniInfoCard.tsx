
import { Icon } from "@elements/Icon";

import type { MiniInfoCardProps } from "@/types/components/modules/property-details";

const MiniInfoCard = ({
  icon,
  note,
  title,
  value,
  className = "",
}: MiniInfoCardProps) => (
  <div
    className={`flex flex-col gap-1 rounded-10 border border-line-strong bg-surface p-4 ${className}`}
  >
    <Icon name={icon} size={20} className="text-ink" />
    <p className="text-sm font-semibold text-ink">{title}</p>
    {value ? <p className="text-sm text-ink">{value}</p> : <></>}
    {note ? <p className="text-xs text-ink-subtle">{note}</p> : <></>}
  </div>
);

export default MiniInfoCard;
