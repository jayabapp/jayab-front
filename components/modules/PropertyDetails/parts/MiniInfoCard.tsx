import type { MiniInfoCardProps } from "@/types/components/modules/property-details";

import ListingGlyph from "./ListingGlyph";

const MiniInfoCard = ({
  icon,
  note,
  title,
  value,
  className = "",
}: MiniInfoCardProps) => (
  <div
    className={`flex min-w-0 flex-col gap-1 rounded-10 border border-line-strong bg-surface p-4 ${className}`}
  >
    <ListingGlyph name={icon} size={20} />
    <p className="pt-1 text-sm font-semibold text-ink">{title}</p>
    {value ? <p className="text-sm text-ink-muted">{value}</p> : <></>}
    {note ? <p className="text-xs text-ink-subtle">{note}</p> : <></>}
  </div>
);

export default MiniInfoCard;
