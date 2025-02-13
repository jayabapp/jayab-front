import React from "react";
import Modal from "../Modal";
import _STRINGS from "@/utils/LocalStrings";
import Button from "../shared/Button/Button";
import { useRouter } from "next/navigation";

const VerifyPropertyModal = ({
  show,
  onHIde,
  callBack,
}: {
  show: boolean;
  onHIde: () => void | null;
  callBack: () => void | null;
}) => {
  const router = useRouter();
  return (
    <Modal onHide={onHIde} show={show}>
      <div className="bg-white p-4 rounded-20  gap-4 flex flex-col items-center justify-center">
        {" "}
        <img className="w-64 aspect-square h-64" src="/assets/icons/adds/verify_prop.svg" />
        <div className="flex flex-col items-center justify-center w-full gap-2">
          {" "}
          <p className="text-sm text-center">{_STRINGS.VERIFY_PROP_MODAL_TEXT}</p>
        </div>
        <div className="w-full flex items-center justify-center gap-4">
          {" "}
          <Button
            containerClass="w-full"
            roundedClass="rounded-full"
            width="w-full"
            title={_STRINGS.VERIFY_PROP}
            onClick={callBack}
          />
        </div>
      </div>
    </Modal>
  );
};

export default VerifyPropertyModal;
