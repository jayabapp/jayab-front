import type { MiniInfoCardProps } from "@/types/components/modules/property-details";

import { Icon } from "@elements/Icon";

const MiniInfoCard = ({
  icon,
  note,
  title,
  value,
  className = "",
}: MiniInfoCardProps) => (
  <div
    className={`flex flex-col gap-1 rounded-10 border border-neutral-200 p-4 ${className}`}
  >
    <Icon name={icon} size={20} className="text-neutral-800" />
    <p className="text-sm font-semibold text-neutral-900">{title}</p>
    {value ? <p className="text-sm text-neutral-800">{value}</p> : <></>}
    {note ? <p className="text-xs text-neutral-500">{note}</p> : <></>}
  </div>
);

export default MiniInfoCard;
