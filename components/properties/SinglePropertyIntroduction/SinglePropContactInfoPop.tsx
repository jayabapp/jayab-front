"use client";

import { usePropertyContact } from "@features/properties/hooks/usePropertyContact";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { useEffect } from "react";

import { ModalBottomSheet } from "@elements/Modal";
import { ModalHeaderPart } from "@elements/Modal";
import _STRINGS from "@/utils/LocalStrings";

type TSinglePropContactInfoProps = {
  show: boolean;
  data: SinglePropDto;
  onHide: () => void | null;
};

const SinglePropContactInfoPop = ({
  data,
  show,
  onHide,
}: TSinglePropContactInfoProps) => {
  const { mutate } = usePropertyContact();

  useEffect(() => {
    if (data?.slug && show) mutate({ propertySlug: data.slug, action: "view" });
  }, [data?.slug, mutate, show]);

  return (
    <>
      <ModalBottomSheet onHide={onHide} show={show}>
        <ModalHeaderPart
          hideArrow
          onHide={onHide}
          title={_STRINGS.CONTACT_INFO}
        />
      </ModalBottomSheet>
    </>
  );
};

export default SinglePropContactInfoPop;
