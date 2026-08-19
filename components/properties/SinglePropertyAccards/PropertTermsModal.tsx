"use client";

import { SinglePropDto } from "@/api_services/property/property.interface";

import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import _STRINGS from "@/utils/LocalStrings";

import PropertyTermsBody from "./PropertyTermsBody";

const PropertTermsModal = ({
  data,
  show,
  onHide,
}: {
  data: SinglePropDto;
  show: boolean;
  onHide: () => void | null;
}) => {
  return (
    <ModalBottomSheet onHide={onHide} show={show}>
      <ModalHeaderPart onHide={onHide} title={_STRINGS.PROP_TERMS} />
      <PropertyTermsBody
        data={data}
        enabled={!!show}
        className="p-4"
        prologueClass=" text-sm font-light"
      />
    </ModalBottomSheet>
  );
};

export default PropertTermsModal;
