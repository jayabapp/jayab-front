import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";
import { useState } from "react";

import ChangeCommissionModal from "./ChangeCommissionModal";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";

export type TChangeCunsultatProps = {
  callenderselectedDate: string;
  selectedDateData?: OwnerCallendarItemDto;
  data: SingleOwnerPropertyDto;
  setCallendarDataState: React.Dispatch<
    React.SetStateAction<OwnerCallendarItemDto[]>
  >;
  isDisabled?: boolean;
};

const ChangeCunsultatCommission = ({
  data,
  isDisabled,
  selectedDateData,
  setCallendarDataState,
}: TChangeCunsultatProps) => {
  const [showPriceRange, setShowPricerange] = useState(false);

  const onHide = () => {
    setShowPricerange(false);
  };

  return (
    <div className="w-full">
      {" "}
      <Button
        onClick={() => {
          if (!!isDisabled) {
            Notify({ body: _STRINGS.SELECT_ONE_DAY_ONLY, type: "warn" });
            return;
          }
          setShowPricerange(true);
        }}
        containerClass="w-full"
        title={_STRINGS.COMMISSION}
        roundedClass="rounded-full"
        disabled={!selectedDateData}
        width="w-full  !text-base !px-0 md:!px-auto md:!text-base  !py-1.5"
      />
      <ChangeCommissionModal
        data={data}
        onHide={onHide}
        show={showPriceRange}
        selectedDateData={selectedDateData}
        setCallendarDataState={setCallendarDataState}
      />
    </div>
  );
};

export default ChangeCunsultatCommission;
