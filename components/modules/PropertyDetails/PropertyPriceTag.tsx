import { useTranslations } from "next-intl";

import type { PropertyPriceTagProps } from "@/types/components/modules/property-details";

import numberWithCommas from "@/helpers/numberWithCommas";

const PropertyPriceTag = ({ price }: PropertyPriceTagProps) => {
  const t = useTranslations("common");

  return (
    <div className="flex flex-row w-fit gap-2 md:gap-2">
      {price?.discountPercentage ? (
        <div className="w-7 gap-0.5 hidden md:flex left-2 flex-col h-5 rounded-md transition-all px-1 py-[0.2rem] bg-danger-500 text-white aspect-square items-center justify-center">
          <p className="text-xxs">%{price?.discountPercentage}</p>
        </div>
      ) : null}

      {price?.discountedPrice ? (
        <p className="text-sm md:text-base line-through opacity-50">
          {numberWithCommas(price?.price)} <span>{t("toman")}</span>
        </p>
      ) : null}

      <p className="font-bold text-sm md:text-base text-link">
        {numberWithCommas(
          price?.discountedPrice ? price?.discountedPrice : price?.price,
        )}{" "}
        <span className="text-xs">{t("toman")}</span>
      </p>

      {price?.discountPercentage ? (
        <div className="w-7 gap-0.5 absolute md:hidden left-2 flex-col h-5 rounded-md transition-all px-1 py-[0.2rem] bg-danger-500 text-white aspect-square flex items-center justify-center">
          <p className="text-xxs">%{price?.discountPercentage}</p>
        </div>
      ) : null}
    </div>
  );
};

export default PropertyPriceTag;
