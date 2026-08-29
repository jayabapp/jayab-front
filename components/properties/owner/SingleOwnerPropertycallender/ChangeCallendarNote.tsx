import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";
import { useState } from "react";

import ChangeCallendarNoteModal from "./ChangeCallendarNoteModal";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Notify from "@elements/Toast";

export type TChangeCallendarNoteProps = {
  isDisabled?: boolean;
  data: SingleOwnerPropertyDto;
  callenderselectedDate: string;
  selectedDateData?: OwnerCallendarItemDto;
  setCallendarDataState: React.Dispatch<
    React.SetStateAction<OwnerCallendarItemDto[]>
  >;
};

const ChangeCallendarNote = ({
  data,
  isDisabled,
  selectedDateData,
  setCallendarDataState,
}: TChangeCallendarNoteProps) => {
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
        title={_STRINGS.MEMO}
        containerClass="w-full"
        width="w-full !py-1.5"
        roundedClass="rounded-full"
        disabled={!selectedDateData}
      />
      <ChangeCallendarNoteModal
        data={data}
        onHide={onHide}
        show={showPriceRange}
        selectedDateData={selectedDateData}
        setCallendarDataState={setCallendarDataState}
      />
    </div>
  );
};

export default ChangeCallendarNote;
