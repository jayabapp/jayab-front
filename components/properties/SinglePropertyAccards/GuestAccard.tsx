import { isMobile, isTablet } from "react-device-detect";
import { SinglePropDto } from "@/api_services/property/property.interface";

import numberWithCommas from "@/helpers/numberWithCommas";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import LinearTextBlock from "./LinearTextBlock";
import _STRINGS from "@/utils/LocalStrings";

const GuestAccard = ({ data }: { data: SinglePropDto }) => {
  return (
    <SimpleAccordion
      isOpenFirst={isMobile || isTablet}
      item={{
        parenClass: " bg-white border border-neutral-300 !mt-0  rounded-10 w-full",
      }}
      title={_STRINGS.GUEST_CAP_AND_EXTRA_COSTS}
    >
      <div className="flex items-center flex-col gap-4">
        <div className="flex w-full flex-col  gap-3">
          <p className=" font-bold">{_STRINGS.GUEST_CAP}</p>

          <LinearTextBlock
            unit={_STRINGS.NAFAR}
            value={data?.std_capacity}
            title={_STRINGS.STANDARD_GUEST_CAP}
          />
          <LinearTextBlock
            unit={_STRINGS.NAFAR}
            value={data?.max_capacity}
            title={_STRINGS.MAX_GUEST_CAP}
          />
        </div>
        <div className="flex w-full flex-col  gap-3">
          <p className=" font-bold">{_STRINGS.EXTRA_COSTS}</p>

          <LinearTextBlock
            unit={_STRINGS.TOMAN}
            title={_STRINGS.EXTRA_GUEST_PRICE}
            value={numberWithCommas(data?.daily_price?.additional_person)}
          />
          <LinearTextBlock
            unit={_STRINGS.TOMAN}
            title={_STRINGS.CLEANING_PRiCE}
            value={numberWithCommas(data?.daily_price?.cleaning)}
          />
        </div>
        <div className="flex w-full flex-col  gap-3">
          <p className=" font-bold">{_STRINGS.RENT_TYPE}</p>
          <LinearTextBlock
            title={_STRINGS.PROP_RENT_TYPE}
            value={data?.rent_type == "DAILY" ? _STRINGS.DAILY : ""}
          />
        </div>
      </div>
    </SimpleAccordion>
  );
};

export default GuestAccard;
