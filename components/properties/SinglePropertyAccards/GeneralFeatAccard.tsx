import { SinglePropDto } from "@/api_services/property/property.interface";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import _STRINGS from "@/utils/LocalStrings";
import { isMobile, isTablet } from "react-device-detect";
import LinearTextBlock from "./LinearTextBlock";
import PropertySelectedOptions from "./PropertySelectedOptions";

const GeneralFeatAccard = ({ data }: { data: SinglePropDto }) => {
  return (
    <SimpleAccordion
      isOpenFirst={isMobile || isTablet}
      item={{
        parenClass: " bg-white border border-gray-300 !mt-0  rounded-10 w-full",
      }}
      title="امکانات عمومی ملک "
    >
      <div className="flex items-center flex-col gap-4">
        <div className="flex w-full flex-col  gap-3">
          <p className=" font-bold">{_STRINGS.WC}</p>

          <LinearTextBlock title={_STRINGS.WC_IR} value={data?.bedrooms?.wc} unit={_STRINGS.ADAD} />
          <LinearTextBlock title={_STRINGS.WC_INTERNATIONAL} value={data?.bedrooms?.wc_ir} unit={_STRINGS.ADAD} />
        </div>
        <div className="flex w-full flex-col  gap-3">
          <p className=" font-bold">{_STRINGS.SHOWER}</p>

          <LinearTextBlock title={_STRINGS.ALL_SHOWER} value={data?.bedrooms?.bathroom_general} unit={_STRINGS.ADAD} />
          <LinearTextBlock title={_STRINGS.TUB_SHOWER} value={data?.bedrooms?.bathroom_tub} unit={_STRINGS.ADAD} />
          <LinearTextBlock title={_STRINGS.SHOWE_IN_WC} value={data?.bedrooms?.bathroom_in_wc} unit={_STRINGS.ADAD} />
          <LinearTextBlock
            title={_STRINGS.MASTER_SHOWER}
            value={data?.bedrooms?.bathroom_master}
            unit={_STRINGS.ADAD}
          />
        </div>
        {!!data?.options?.cool_heat ? (
          <div className="flex w-full flex-col  gap-3">
            <p className=" font-bold">{_STRINGS.COOL_HEAT}</p>
            <div className="w-full gap-3 flex flex-wrap">
              {" "}
              {data?.options?.cool_heat?.map((e) => (
                <PropertySelectedOptions title={e} key={`${e}poolType`} />
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
        {!!data?.options?.welfare ? (
          <div className="flex w-full flex-wrap  gap-3">
            <p className=" font-bold">{_STRINGS.WELFARE}</p>
            <div className="w-full gap-3 flex flex-wrap">
              {" "}
              {data?.options?.welfare?.map((e) => (
                <PropertySelectedOptions title={e} key={`${e}poolType`} />
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </SimpleAccordion>
  );
};

export default GeneralFeatAccard;
