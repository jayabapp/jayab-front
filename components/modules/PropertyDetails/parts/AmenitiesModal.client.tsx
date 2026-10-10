"use client";

import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useTranslations } from "next-intl";

import type { AmenitiesModalProps } from "@/types/components/modules/property-details";

import IconListItem from "./IconListItem";

const GROUP_TITLES = {
  welfare: "common.welfare",
  cool_heat: "common.coolHeat",
  kitchen: "common.kitchenAcc",
  entertainment: "common.entertainment",
  pool_type: "common.poolType",
} as const;

const AmenitiesModal = ({ amenities, onHide, show }: AmenitiesModalProps) => {
  const t = useTranslations();

  const groups = amenities.reduce<Record<string, typeof amenities>>(
    (grouped, item) => {
      grouped[item.group] = [...(grouped[item.group] ?? []), item];
      return grouped;
    },
    {},
  );

  return (
    <ModalBottomSheet
      show={show}
      onHide={onHide}
      options={{ containerClass: "md:w-[40rem]" }}
    >
      <ModalHeaderPart
        hideArrow
        onHide={onHide}
        title={t("listing.propertyFacilities")}
      />
      <div className="flex flex-col gap-6 p-4">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="flex flex-col gap-3">
            <p className="text-sm font-bold text-neutral-900">
              {Object.hasOwn(GROUP_TITLES, group)
                ? t(GROUP_TITLES[group as keyof typeof GROUP_TITLES])
                : ""}
            </p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {items.map((item) => (
                <IconListItem
                  label={item.title}
                  icon={item.fallbackIcon}
                  key={`${group}-${item.title}`}
                  image={item.icon ? getPropertyImageUrl(item.icon) : null}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModalBottomSheet>
  );
};

export default AmenitiesModal;
