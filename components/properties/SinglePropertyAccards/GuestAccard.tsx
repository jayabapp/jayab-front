import { SinglePropDto } from "@/api_services/property/property.interface";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import LinearTextBlock from "./LinearTextBlock";
import numberWithCommas from "@/helpers/numberWithCommas";

const GuestAccard = ({ data }: { data: SinglePropDto }) => {
  return (
    <SimpleAccordion
      item={{
        parenClass: " bg-white border border-gray-300 !mt-0  rounded-10 w-full",
        noBorder: true,
        titleClass: "font-bold",
      }}
      title="تعداد نفرات و قیمت ها"
    >
      <div className="flex items-center flex-col gap-4">
        <div className="flex w-full flex-col  gap-3">
          <p className="text-primary-700 font-bold">{_STRINGS.GUEST_CAP}</p>

          <LinearTextBlock title={_STRINGS.STANDARD_GUEST_CAP} value={data?.std_capacity} unit={_STRINGS.NAFAR} />
          <LinearTextBlock title={_STRINGS.MAX_GUEST_CAP} value={data?.max_capacity} unit={_STRINGS.NAFAR} />
        </div>
        <div className="flex w-full flex-col  gap-3">
          <p className="text-primary-700 font-bold">{_STRINGS.RENT_TYPE}</p>

          <LinearTextBlock title={_STRINGS.PROP_RENT_TYPE} value={data?.rent_type == "DAILY" ? _STRINGS.DAILY : ""} />
        </div>
        <div className="flex w-full flex-col  gap-3">
          <p className="text-primary-700 font-bold">{_STRINGS.DAYLI_RENT_PRICE}</p>

          <LinearTextBlock
            title={_STRINGS.WEEK_STARTER_DAYS_PRICE}
            value={numberWithCommas(data?.daily_price?.normal)}
            unit={_STRINGS.TOMAN}
          />
          <LinearTextBlock
            title={_STRINGS.WEEK_WENSDAY_PRICE}
            value={numberWithCommas(data?.daily_price.wednesday)}
            unit={_STRINGS.TOMAN}
          />
          <LinearTextBlock
            title={_STRINGS.WEEK_THURSDAY_PRICE}
            value={numberWithCommas(data?.daily_price.thursday)}
            unit={_STRINGS.TOMAN}
          />
          <LinearTextBlock
            title={_STRINGS.WEEK_FRIDAY_PRICE}
            value={numberWithCommas(data?.daily_price.friday)}
            unit={_STRINGS.TOMAN}
          />
          <LinearTextBlock
            title={_STRINGS.WEEK_PEAK_PRICE}
            value={numberWithCommas(data?.daily_price.peak)}
            unit={_STRINGS.TOMAN}
          />
          <LinearTextBlock
            title={_STRINGS.CLEANING_PRiCE}
            value={numberWithCommas(data?.daily_price.cleaning)}
            unit={_STRINGS.TOMAN}
          />
          <LinearTextBlock
            title={_STRINGS.EXTRA_GUEST_PRICE}
            value={numberWithCommas(data?.daily_price.additional_person)}
            unit={_STRINGS.TOMAN}
          />
        </div>
      </div>
    </SimpleAccordion>
  );
};

export default GuestAccard;
