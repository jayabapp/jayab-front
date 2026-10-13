import { useLocale, useTranslations } from "next-intl";
import { formatListingPriceFor } from "@/helpers/intl/number";
import { localizeDigits } from "@/helpers/intl/digits";
import { resolveLocale } from "@/i18n/config";
import { Icon } from "@elements/Icon";

import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";
import type { TKeyFact } from "@/types/components/modules/property-details";

const COLUMN_CLASS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const KeyFacts = ({ property }: PropertySpecsSectionProps) => {
  const t = useTranslations();
  const locale = resolveLocale(useLocale());
  const formatNumber = (value: number | string) =>
    formatListingPriceFor(value, locale);
  const formatText = (value: string) =>
    locale === "fa"
      ? value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])
      : localizeDigits(value, locale);
  const join = (parts: Array<string | null | undefined>) =>
    parts.filter(Boolean).join(" + ");

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

  const buildingArea = property?.building_area
    ? `${formatNumber(property.building_area)} ${t("common.meter")} ${t("listing.buildingAreaSuffix")}`
    : null;
  const landArea = property?.land_area
    ? `${formatNumber(property.land_area)} ${t("common.meter")} ${t("listing.surroundingAreaSuffix")}`
    : null;

  const facts: TKeyFact[] = [];

  if (propertyType)
    facts.push({
      icon: "home",
      title: propertyType,
      note: property?.options?.ownership,
    });

  if (maxCapacity)
    facts.push({
      icon: "users",
      title: formatText(
        `${t("listing.upTo")} ${t("listing.guestsCount", { count: Number(maxCapacity) })}`,
      ),
      note: formatText(
        join([
          stdCapacity
            ? t("listing.standardGuestsCount", { count: Number(stdCapacity) })
            : null,
          extraGuests
            ? t("listing.extraGuestsCount", { count: Number(extraGuests) })
            : null,
        ]),
      ),
    });

  if (
    totalBedrooms ||
    bedCount ||
    bedrooms?.additional_bed ||
    bedrooms?.sofa_bed
  )
    facts.push({
      icon: "bed",
      title: formatText(
        t("listing.roomsCount", { count: Number(totalBedrooms) }),
      ),
      note: join([
        bedCount
          ? formatText(t("listing.bedsCount", { count: Number(bedCount) }))
          : null,
        bedrooms?.additional_bed
          ? `${formatNumber(bedrooms.additional_bed)} ${t("listing.extraBedding")}`
          : null,
        bedrooms?.sofa_bed ? t("common.sofaBed") : null,
      ]),
    });

  if (buildingArea || landArea)
    facts.push({
      icon: "ruler",
      title: buildingArea ?? landArea ?? "",
      note: buildingArea && landArea ? landArea : undefined,
    });

  if (!facts.length) return <></>;

  return (
    <div
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-20 border border-line-strong bg-line ${COLUMN_CLASS[facts.length]}`}
    >
      {facts.map((fact) => (
        <div
          key={fact.icon}
          className="flex flex-col gap-1 bg-surface p-4 odd:last:col-span-2 lg:p-5 lg:odd:last:col-span-1"
        >
          <Icon name={fact.icon} size={24} className="text-ink-muted" />
          <p className="pt-1 text-base font-bold text-ink">{fact.title}</p>
          {fact.note ? (
            <p className="text-xs text-ink-subtle md:text-sm">{fact.note}</p>
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};

export default KeyFacts;
