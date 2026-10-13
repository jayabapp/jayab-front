import { useLocale, useTranslations } from "next-intl";
import { formatListingPriceFor } from "@/helpers/intl/number";
import { resolveLocale } from "@/i18n/config";

import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import FactRow from "./FactRow";

const KeyFacts = ({ property }: PropertySpecsSectionProps) => {
  const t = useTranslations();
  const locale = resolveLocale(useLocale());
  const formatNumber = (value: number | string) =>
    formatListingPriceFor(value, locale);
  const formatText = (value: string) =>
    locale === "fa"
      ? value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])
      : value;

  const propertyType = property?.options?.property_type;

  const stdCapacity = property?.std_capacity ?? 0;
  const maxCapacity = property?.max_capacity ?? 0;
  const extraGuests = Math.max(maxCapacity - stdCapacity, 0);

  const bedrooms = property?.bedrooms;
  const totalBedrooms = bedrooms?.total_bedrooms ?? 0;
  const bedCount = (bedrooms?.bedrooms ?? []).reduce(
    (total, beds) => total + (Number(beds) || 0),
    0,
  );

  const buildingAreaText = property?.building_area
    ? `${formatNumber(property.building_area)} ${t("common.meter")} ${t("listing.buildingAreaSuffix")}`
    : null;
  const surroundingAreaText = property?.land_area
    ? `${formatNumber(property.land_area)} ${t("common.meter")} ${t("listing.surroundingAreaSuffix")}`
    : null;
  const areaTitle = [buildingAreaText, surroundingAreaText]
    .filter(Boolean)
    .join(" + ");

  return (
    <div className="grid grid-cols-1 gap-4">
      {propertyType ? (
        <FactRow
          icon="home"
          title={propertyType}
          value={property?.options?.ownership}
        />
      ) : (
        <></>
      )}

      {maxCapacity ? (
        <FactRow
          icon="users"
          title={t("listing.capacity")}
          value={formatText(
            `${t("listing.upTo")} ${t("listing.guestsCount", { count: Number(maxCapacity) })}`,
          )}
          summary={[
            stdCapacity
              ? formatText(
                  t("listing.standardGuestsCount", {
                    count: Number(stdCapacity),
                  }),
                )
              : null,
            extraGuests
              ? formatText(
                  t("listing.extraGuestsCount", { count: Number(extraGuests) }),
                )
              : null,
          ]}
        />
      ) : (
        <></>
      )}

      {totalBedrooms ||
      bedCount ||
      bedrooms?.additional_bed ||
      bedrooms?.sofa_bed ? (
        <FactRow
          icon="bed"
          title={t("listing.sleepingService")}
          value={formatText(
            t("listing.roomsCount", { count: Number(totalBedrooms) }),
          )}
          summary={[
            bedCount
              ? formatText(t("listing.bedsCount", { count: Number(bedCount) }))
              : null,
            bedrooms?.additional_bed
              ? `${formatNumber(bedrooms.additional_bed)} ${t("listing.extraBedding")}`
              : null,
            bedrooms?.sofa_bed ? t("common.sofaBed") : null,
          ]}
        />
      ) : (
        <></>
      )}

      {areaTitle ? (
        <FactRow
          icon="ruler"
          title={t("listing.areaLabel")}
          value={areaTitle}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default KeyFacts;
