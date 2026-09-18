import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";
import type { IconName } from "@/types/components/elements/icon";

import _STRINGS from "@/utils/LocalStrings";
import MiniInfoCard from "./MiniInfoCard";

const MAX_HIGHLIGHTS = 4;

const Highlights = ({ property }: PropertySpecsSectionProps) => {
  const guestTypes = property?.options?.guest_type ?? [];

  const highlights: Array<{ icon: IconName; title: string } | null> = [
    property?.is_authorized
      ? { icon: "shield", title: _STRINGS.VERIFIED }
      : null,
    guestTypes.some((type) => `${type}`.includes("خانواده"))
      ? { icon: "users", title: _STRINGS.FAMILY_FRIENDLY }
      : null,
    property?.is_chat_enabled
      ? { icon: "chat", title: _STRINGS.CHAT_AVAILABLE }
      : null,
    property?.has_pool
      ? { icon: "pool", title: property?.options?.pool_type?.[0] || _STRINGS.HAS_POOL }
      : null,
  ];

  const visible = highlights
    .filter((item): item is { icon: IconName; title: string } => Boolean(item))
    .slice(0, MAX_HIGHLIGHTS);

  if (!visible.length) return <></>;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {visible.map((item) => (
        <MiniInfoCard key={item.title} icon={item.icon} title={item.title} />
      ))}
    </div>
  );
};

export default Highlights;
