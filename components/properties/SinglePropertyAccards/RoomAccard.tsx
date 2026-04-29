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
        parenClass: " bg-white border border-gray-300 !mt-0  rounded-10 w-full",
      }}
      title="اطلاعات اتاق و رخت خواب"
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
          value={!!data?.bedrooms?.additional_bed ? _STRINGS.HAS : _STRINGS.DOSE_NOT_HAVE}
        />
      </div>
    </SimpleAccordion>
  );
};

export default RoomAccard;
