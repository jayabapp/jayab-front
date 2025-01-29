import { OwnerCallendarItemDto, SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import Button from "@/components/shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import React, { useState } from "react";
import ChangeCallendarNoteModal from "./ChangeCallendarNoteModal";

const ChangeCallendarNote = ({
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
        width="w-full !py-1.5"
        roundedClass="rounded-full"
        title={_STRINGS.MEMO}
      />
      <ChangeCallendarNoteModal
        data={data}
        setCallendarDataState={setCallendarDataState}
        selectedDateData={selectedDateData}
        onHide={onHide}
        show={showPriceRange}
      />
    </div>
  );
};

export default ChangeCallendarNote;
