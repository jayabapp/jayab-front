import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";
import type { IconName } from "@/types/components/elements/icon";
import { Icon } from "@elements/Icon";

import _STRINGS from "@/utils/LocalStrings";

// The pool is already a row in KeyFacts, so it is not repeated here.
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
  ];

  const visible = highlights.filter(
    (item): item is { icon: IconName; title: string } => Boolean(item),
  );

  if (!visible.length) return <></>;

  return (
    <ul className="flex flex-wrap gap-2">
      {visible.map((item) => (
        <li
          key={item.title}
          className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900"
        >
          <Icon name={item.icon} size={20} className="text-neutral-800" />
          {item.title}
        </li>
      ))}
    </ul>
  );
};

export default Highlights;
