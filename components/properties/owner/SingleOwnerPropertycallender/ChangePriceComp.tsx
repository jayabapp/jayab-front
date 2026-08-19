import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";
import { useState } from "react";

import ChangePriceModal from "./ChangePriceModal";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";

export type TChangePriceProps = {
  callenderselectedDates: string[];
  selectedDatesData: OwnerCallendarItemDto[];
  data: SingleOwnerPropertyDto;
  setCallendarDataState: React.Dispatch<
    React.SetStateAction<OwnerCallendarItemDto[]>
  >;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangePriceComp = ({
  data,
  setRefresh,
  selectedDatesData,
  setCallendarDataState,
  callenderselectedDates,
}: TChangePriceProps) => {
  const [showPriceRange, setShowPricerange] = useState(false);

  const onHide = () => {
    setShowPricerange(false);
  };

  return (
    <div className="w-full">
      {" "}
      <Button
        onClick={() => {
          setShowPricerange(true);
        }}
        width="w-full !py-1.5"
        containerClass="w-full"
        roundedClass="rounded-full"
        title={_STRINGS.CHANGE_PRICE}
        disabled={callenderselectedDates.length === 0}
      />
      <ChangePriceModal
        data={data}
        onHide={onHide}
        show={showPriceRange}
        setRefresh={setRefresh}
        selectedDatesData={selectedDatesData}
        setCallendarDataState={setCallendarDataState}
        callenderselectedDates={callenderselectedDates}
      />
    </div>
  );
};

export default ChangePriceComp;
