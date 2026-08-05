import { SinglePropDto } from "@/api_services/property/property.interface";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import _STRINGS from "@/utils/LocalStrings";
import { isMobile, isTablet } from "react-device-detect";
import LinearTextBlock from "./LinearTextBlock";
import PropertySelectedOptions from "./PropertySelectedOptions";

const FeatAccard = ({ data }: { data: SinglePropDto }) => {
  return (
    <SimpleAccordion
      isOpenFirst={isMobile || isTablet}
      item={{
        parenClass: " bg-white border border-gray-300 !mt-0  rounded-10 w-full",
      }}
      title={_STRINGS.PROPERTY_FACILITIES}
    >
      <div className="flex items-center flex-col gap-4">
        <LinearTextBlock
          title={_STRINGS.POOL_STATUS}
          value={data?.has_pool ? _STRINGS.HAS_POOL : _STRINGS.NO_POOL}
        />
        {!!data?.has_pool && !!data?.options?.pool_type?.length ? (
          <div className="flex w-full flex-col gap-3">
            <p className="font-bold">{_STRINGS.POOL_TYPE}</p>
            {data.options.pool_type.map((option) => (
              <PropertySelectedOptions title={option} key={`${option}poolType`} />
            ))}
          </div>
        ) : (
          <></>
        )}
        {!!data?.options?.entertainment?.length ? (
          <div className="flex w-full flex-col  gap-3">
            <p className=" font-bold">{_STRINGS.ENTERTAINMENT}</p>
            {data?.options?.entertainment?.map((e) => (
              <PropertySelectedOptions title={e} key={`${e}poolType`} />
            ))}
          </div>
        ) : (
          <></>
        )}
        {!!data?.options?.kitchen?.length ? (
          <div className="flex w-full flex-col   gap-3">
            <p className=" font-bold">{_STRINGS.KITCHEN_ACC}</p>
            {data?.options?.kitchen?.map((e) => (
              <PropertySelectedOptions title={e} key={`${e}poolType`} />
            ))}
          </div>
        ) : (
          <></>
        )}
        {!!data?.options?.cool_heat?.length ? (
          <div className="flex w-full flex-col gap-3">
            <p className="font-bold">{_STRINGS.COOL_HEAT}</p>
            <div className="flex w-full flex-wrap gap-3">
              {data.options.cool_heat.map((option) => (
                <PropertySelectedOptions title={option} key={`${option}coolHeat`} />
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
        {!!data?.options?.welfare?.length ? (
          <div className="flex w-full flex-col gap-3">
            <p className="font-bold">{_STRINGS.WELFARE}</p>
            <div className="flex w-full flex-wrap gap-3">
              {data.options.welfare.map((option) => (
                <PropertySelectedOptions title={option} key={`${option}welfare`} />
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}

        {data?.property_descriptions?.facility_dscr ? (
          <div className=" flex w-full flex-col items-start justify-start gap-2">
            <p className="text-sm font-medium ">{_STRINGS.OTHER_ACCS}</p>
            <p className="font-medium"> {data?.property_descriptions?.facility_dscr}</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </SimpleAccordion>
  );
};

export default FeatAccard;
