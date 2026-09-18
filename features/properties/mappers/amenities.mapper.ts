import type { SinglePropDto } from "@/api_services/property/property.interface";
import type { ImageDto } from "@/api_services/auth/auth.interface";

import { AMENITY_PRIORITY } from "@features/properties/constants/amenities";
import { AMENITY_GROUPS } from "@features/properties/constants/amenities";

export type AmenityItem = {
  group: string;
  title: string;
  icon: ImageDto | null;
};

const priorityOf = (title: string) => {
  const index = AMENITY_PRIORITY.indexOf(title);
  return index === -1 ? AMENITY_PRIORITY.length : index;
};

export const toAmenityItems = (property?: SinglePropDto): AmenityItem[] => {
  const groups: readonly string[] = AMENITY_GROUPS;

  const fromItems = (property?.option_items ?? [])
    .filter((item) => Boolean(item?.title) && groups.includes(item?.group))
    .map((item) => ({
      group: item.group,
      title: item.title,
      icon: item.icon ?? null,
    }));

  const items: AmenityItem[] = fromItems.length
    ? fromItems
    : groups.flatMap((group) => {
        const value = (
          property?.options as unknown as Record<string, unknown>
        )?.[group];
        const titles = Array.isArray(value)
          ? (value as string[])
          : value
            ? [String(value)]
            : [];
        return titles
          .filter(Boolean)
          .map((title) => ({ group, title, icon: null as ImageDto | null }));
      });

  return [...items].sort((a, b) => priorityOf(a.title) - priorityOf(b.title));
};
