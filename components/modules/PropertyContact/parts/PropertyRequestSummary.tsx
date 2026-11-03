import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { PROPERTY_IMAGE_QUALITY } from "@features/properties/constants/image";
import { nightsBetween } from "@features/reservations/lib/stay-range";
import { useListSeparator } from "@hooks/useListSeparator";
import { useJalaliFormat } from "@hooks/useJalaliFormat";
import { useTranslations } from "next-intl";
import { useFormatToman } from "@hooks/useFormatToman";
import { ContentImage } from "@elements/Image";
import { Icon } from "@elements/Icon";

import type { PropertyRequestSummaryProps } from "@/types/components/modules/property-contact";

// Weekday and day without a comma: "سه‌شنبه ۵ آبان تا سه‌شنبه ۱۲ آبان | ۷ شب".
const WEEKDAY_DAY = "dddd jD jMMMM";

const PropertyRequestSummary = ({
  property,
  stay,
  onEdit,
}: PropertyRequestSummaryProps) => {
  const t = useTranslations();
  const jalali = useJalaliFormat();
  const sep = useListSeparator();
  const formatToman = useFormatToman();
  const place = [property.city, property.region || property.province]
    .filter(Boolean)
    .join(sep);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-10">
          <ContentImage
            fill
            sizes="64px"
            loading="lazy"
            className="object-cover"
            quality={PROPERTY_IMAGE_QUALITY}
            alt={property.featureImage?.alt || property.title}
            src={getPropertyImageUrl(property.featureImage)}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="line-clamp-1 text-sm font-semibold text-ink">
            {property.title}
          </p>
          {place ? (
            <p className="line-clamp-1 text-xs text-ink-subtle">{place}</p>
          ) : null}
        </div>
      </div>

      {stay ? (
        <div className="flex flex-col gap-2 rounded-10 bg-surface-muted p-3 text-sm text-ink">
          <div className="flex items-center gap-2">
            <Icon name="calendar" size={20} className="text-link" />
            <span className="flex-1">
              {jalali(stay.startDate, WEEKDAY_DAY)} {t("common.to")}{" "}
              {jalali(stay.endDate, WEEKDAY_DAY)}
              {" | "}
              {t("reserve.nights", {
                count:
                  stay.nights ?? nightsBetween(stay.startDate, stay.endDate),
              })}
            </span>
            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className="cursor-pointer text-xs text-link"
              >
                {t("common.edit")}
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Icon name="users" size={20} className="text-link" />
            <span>{t("common.people", { count: Number(stay.guests) })}</span>
          </div>
          {stay.total ? (
            <div className="flex items-center justify-between border-t border-line pt-2">
              <span className="text-ink-muted">
                {t("reserve.approxStayCost")}
              </span>
              <span className="font-bold">{formatToman(stay.total)}</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default PropertyRequestSummary;
