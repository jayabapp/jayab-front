"use client";

import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import type { AmenitiesModalProps } from "@/types/components/modules/property-details";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";

import _STRINGS from "@/utils/LocalStrings";
import IconListItem from "./IconListItem";

const GROUP_TITLES: Record<string, string> = {
  welfare: _STRINGS.WELFARE,
  cool_heat: _STRINGS.COOL_HEAT,
  kitchen: _STRINGS.KITCHEN_ACC,
  entertainment: _STRINGS.ENTERTAINMENT,
  pool_type: _STRINGS.POOL_TYPE,
};

const AmenitiesModal = ({ amenities, onHide, show }: AmenitiesModalProps) => {
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
        title={_STRINGS.PROPERTY_FACILITIES}
      />
      <div className="flex flex-col gap-6 p-4">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="flex flex-col gap-3">
            <p className="text-sm font-bold text-neutral-900">
              {GROUP_TITLES[group] ?? ""}
            </p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {items.map((item) => (
                <IconListItem
                  key={`${group}-${item.title}`}
                  label={item.title}
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
