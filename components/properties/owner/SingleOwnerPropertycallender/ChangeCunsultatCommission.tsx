import { produce } from "immer";
import { OwnerCallendarItemDto, SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import Button from "@/components/shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation } from "@tanstack/react-query";
import moment from "moment-jalaali";
import React, { useState } from "react";
import ChangePriceModal from "./ChangePriceModal";
import ChangeCommissionModal from "./ChangeCommissionModal";

const ChangeCunsultatCommission = ({
  data,
  callenderselectedDate,
  setCallendarDataState,
  selectedDateData,
}: {
  callenderselectedDate: string;
  selectedDateData?: OwnerCallendarItemDto;
  data: SingleOwnerPropertyDto;
  setCallendarDataState: React.Dispatch<React.SetStateAction<OwnerCallendarItemDto[]>>;
}) => {
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
        disabled={!selectedDateData}
        // loading={isPending}
        containerClass="w-full"
        width="w-full  !text-base !px-0 md:!px-auto md:!text-base  !py-1.5"
        roundedClass="rounded-full"
        title={_STRINGS.COMMISSION}
      />
      <ChangeCommissionModal
        data={data}
        setCallendarDataState={setCallendarDataState}
        selectedDateData={selectedDateData}
        onHide={onHide}
        show={showPriceRange}
      />
    </div>
  );
};

export default ChangeCunsultatCommission;
