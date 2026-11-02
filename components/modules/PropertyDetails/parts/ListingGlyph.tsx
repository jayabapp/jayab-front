import { OVERVIEW_ICONS } from "@features/properties/constants/static-icons";
import { StaticIcon } from "@elements/StaticIcon";
import { Icon } from "@elements/Icon";

import type { ListingGlyphProps } from "@/types/components/modules/property-details";

const ListingGlyph = ({ name, size, className = "" }: ListingGlyphProps) => {
  const icon = OVERVIEW_ICONS[name];
  return icon ? (
    <StaticIcon icon={icon} size={size} className={className} />
  ) : (
    <Icon name={name} size={size} className={className} />
  );
};

export default ListingGlyph;
