import { SinglePropDto } from "@/api_services/property/property.interface";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import _STRINGS from "@/utils/LocalStrings";
import { isMobile, isTablet } from "react-device-detect";
import LinearTextBlock from "./LinearTextBlock";

const RoomAccard = ({ data }: { data: SinglePropDto }) => {
  return (
    <SimpleAccordion
      isOpenFirst={isMobile || isTablet}
      item={{
        parenClass: " bg-white border border-neutral-300 !mt-0  rounded-10 w-full",
      }}
      title={_STRINGS.ROOMS_INFO}
    >
      <div className="flex items-center flex-col gap-4">
        <LinearTextBlock title={_STRINGS.ROOM_COUNTS} value={data?.bedrooms?.total_bedrooms} unit={_STRINGS.ROOM} />

        {data?.bedrooms?.bedrooms?.map((e, index) => (
          <LinearTextBlock
            key={`${e}${index}bedroom`}
            title={`تعداد تخت اتاق ${index + 1}`}
            value={e}
            unit={_STRINGS.ADAD}
          />
        ))}
        <LinearTextBlock title={_STRINGS.EXTRA_BED} value={data?.bedrooms?.additional_bed} unit={_STRINGS.ADAD} />
        <LinearTextBlock
          title={_STRINGS.MASTER_ROOM}
          value={!!data?.bedrooms?.master_room ? _STRINGS.HAS : _STRINGS.DOSE_NOT_HAVE}
        />
        <LinearTextBlock
          title={_STRINGS.SOFA_BED}
          value={!!data?.bedrooms?.sofa_bed ? _STRINGS.HAS : _STRINGS.DOSE_NOT_HAVE}
        />
        <div className="flex w-full flex-col gap-3">
          <p className="font-bold">{_STRINGS.WC}</p>
          <LinearTextBlock title={_STRINGS.WC_IR} value={data?.bedrooms?.wc} unit={_STRINGS.ADAD} />
          <LinearTextBlock title={_STRINGS.WC_INTERNATIONAL} value={data?.bedrooms?.wc_ir} unit={_STRINGS.ADAD} />
        </div>
        <div className="flex w-full flex-col gap-3">
          <p className="font-bold">{_STRINGS.SHOWER}</p>
          <LinearTextBlock
            title={_STRINGS.ALL_SHOWER}
            value={data?.bedrooms?.bathroom_general}
            unit={_STRINGS.ADAD}
          />
          <LinearTextBlock
            title={_STRINGS.TUB_SHOWER}
            value={data?.bedrooms?.bathroom_tub}
            unit={_STRINGS.ADAD}
          />
          <LinearTextBlock
            title={_STRINGS.SHOWE_IN_WC}
            value={data?.bedrooms?.bathroom_in_wc}
            unit={_STRINGS.ADAD}
          />
          <LinearTextBlock
            title={_STRINGS.MASTER_SHOWER}
            value={data?.bedrooms?.bathroom_master}
            unit={_STRINGS.ADAD}
          />
        </div>
      </div>
    </SimpleAccordion>
  );
};

export default RoomAccard;
