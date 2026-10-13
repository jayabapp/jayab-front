import { useLocale, useTranslations } from "next-intl";
import { formatListingPriceFor } from "@/helpers/intl/number";
import { resolveLocale } from "@/i18n/config";

import type { PropertyPriceTagProps } from "@/types/components/modules/property-details";

const PropertyPriceTag = ({
  price,
  sizeClass = "text-sm",
}: PropertyPriceTagProps) => {
  const t = useTranslations("common");
  const locale = resolveLocale(useLocale());
  const formatNumber = (value?: number | null) =>
    formatListingPriceFor(value, locale);

  return (
    <div className="flex w-fit flex-row items-baseline gap-2">
      {price?.discountPercentage ? (
        <div className="w-7 gap-0.5 hidden md:flex end-2 flex-col h-5 rounded-md transition-all px-1 py-[0.2rem] bg-danger-500 text-white aspect-square items-center justify-center">
          <p className="text-xxs">%{price?.discountPercentage}</p>
        </div>
      ) : null}

      {price?.discountedPrice ? (
        <p className="text-sm md:text-base line-through opacity-50">
          {formatNumber(price?.price)} <span>{t("toman")}</span>
        </p>
      ) : null}

      <p className={`font-bold text-link ${sizeClass}`}>
        {formatNumber(
          price?.discountedPrice ? price?.discountedPrice : price?.price,
        )}{" "}
        <span className="text-xs">{t("toman")}</span>
      </p>

      {price?.discountPercentage ? (
        <div className="w-7 gap-0.5 absolute md:hidden end-2 flex-col h-5 rounded-md transition-all px-1 py-[0.2rem] bg-danger-500 text-white aspect-square flex items-center justify-center">
          <p className="text-xxs">%{price?.discountPercentage}</p>
        </div>
      ) : null}
    </div>
  );
};

export default PropertyPriceTag;
