import { useTranslations } from "next-intl";

import type { PropertyPriceProps } from "@/types/components/modules/property-grid";

import numberWithCommas from "@/helpers/numberWithCommas";

const PropertyPrice = ({
  data,
  ribbon,
  containerClass,
  emphasis = false,
  reserveDiscountSpace = false,
}: PropertyPriceProps) => {
  const t = useTranslations("common");

  return (
    <div className={containerClass || "flex flex-col w-fit gap-0 md:gap-0"}>
      {ribbon?.ribbon_title ? (
        <div
          style={{
            background: ribbon?.ribbon_bg_color,
            color: ribbon?.ribbon_title_color,
          }}
          className="absolute left-[-70px] top-4 z-10 w-[200px] -rotate-45 py-0.5 text-xs flex items-center justify-center text-center font-medium shadow-md"
        >
          {ribbon?.ribbon_title}
        </div>
      ) : null}

      {data?.discounted_price ? (
        <div className="relative gap-2 flex items-center">
          <p
            className={`relative flex items-center line-through opacity-65 ${
              emphasis ? "text-sm" : "text-xs md:text-xs"
            }`}
          >
            {numberWithCommas(data?.price)}
          </p>
          {data?.discount_percentage ? (
            <div
              className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-full bg-danger-500 px-1 py-[0.2rem] text-white transition-all ${
                emphasis ? "h-6 w-9" : "h-5 w-7"
              }`}
            >
              <p className={emphasis ? "text-xs" : "text-xxs"}>
                %{data?.discount_percentage}
              </p>
            </div>
          ) : null}
        </div>
      ) : reserveDiscountSpace ? (
        <div aria-hidden="true" className={emphasis ? "min-h-6" : "min-h-5"} />
      ) : null}

      <p
        className={`font-bold ${emphasis ? "text-xl md:text-2xl" : "text-xs"}`}
      >
        {numberWithCommas(
          data?.discounted_price ? data?.discounted_price : data?.price,
        )}{" "}
        <span className={emphasis ? "text-xs" : "text-xxs"}>{t("toman")}</span>
      </p>
    </div>
  );
};

export default PropertyPrice;
