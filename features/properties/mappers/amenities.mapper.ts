import type { SinglePropDto } from "@/api_services/property/property.interface";
import type { ImageDto } from "@/api_services/auth/auth.interface";
import type { IconName } from "@/types/components/elements/icon";

import { AMENITY_PRIORITY } from "@features/properties/constants/amenities";
import { AMENITY_GROUPS } from "@features/properties/constants/amenities";

export type AmenityItem = {
  group: string;
  title: string;
  icon: ImageDto | null;
  fallbackIcon: IconName;
};

const amenityIcon = (title: string, group: string): IconName => {
  const value = title.replace(/\u200c/g, " ").toLowerCase();

  if (value.includes("استخر")) return "pool";
  if (value.includes("وای فای") || value.includes("اینترنت")) return "wifi";
  if (value.includes("پارکینگ")) return "parking";
  if (value.includes("تلویزیون")) return "television";
  if (value.includes("یخچال")) return "refrigerator";
  if (value.includes("مایکروفر")) return "microwave";
  if (value.includes("لباسشویی")) return "washing-machine";
  if (value.includes("باربیکیو")) return "grill";
  if (value.includes("تراس")) return "terrace";
  if (value.includes("آلاچیق")) return "gazebo";
  if (value.includes("بیلیارد")) return "billiard";
  if (value.includes("فوتبال دستی")) return "foosball";
  if (value.includes("کولر") || value.includes("گرمایش"))
    return "air-conditioner";

  const groupIcons: Record<string, IconName> = {
    welfare: "sparkles",
    cool_heat: "air-conditioner",
    kitchen: "kitchen",
    entertainment: "party",
    pool_type: "pool",
  };
  return groupIcons[group] ?? "home";
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
      fallbackIcon: amenityIcon(item.title, item.group),
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
          .map((title) => ({
            group,
            title,
            icon: null as ImageDto | null,
            fallbackIcon: amenityIcon(title, group),
          }));
      });

  return [...items].sort((a, b) => priorityOf(a.title) - priorityOf(b.title));
};
