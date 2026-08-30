"use client";

import type { PropertyContactModalProps } from "@/types/components/modules/property-contact";
import { usePropertyContact } from "@features/properties/hooks/usePropertyContact";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { useEffect } from "react";

import PropertyContactRow from "./parts/PropertyContactRow.client";
import Skeleton from "@elements/Skeleton/Skeleton";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

const CONTACT_SHEET_CLASS =
  "mx-auto rounded-t-20 absolute pb-[1.5rem] lg:pb-4 bottom-0 lg:translate-x-1/2 lg:right-1/2 w-full lg:w-[calc(35svw)] bg-white overflow-y-scroll";

const PropertyContactModal = ({
  type,
  show,
  onHide,
  propertySlug,
}: PropertyContactModalProps) => {
  const { data: contactInfo, isPending, mutate } = usePropertyContact();

  useEffect(() => {
    if (propertySlug && show) mutate({ propertySlug, action: "view" });
  }, [propertySlug, mutate, show]);

  return (
    <ModalBottomSheet
      show={show}
      onHide={onHide}
      options={{ containerClass: CONTACT_SHEET_CLASS }}
    >
      <ModalHeaderPart
        hideArrow
        onHide={onHide}
        title={_STRINGS.CONTACT_INFO}
      />

      <div className="w-full p-4 flex flex-col">
        {isPending ? (
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-8 w-full rounded-full" />
            <Skeleton className="h-8 w-full rounded-full" />
          </div>
        ) : isEmpty(contactInfo) ? (
          <p className="w-full text-center">{_STRINGS?.EMPTY_CONTACT_LIST}</p>
        ) : (
          contactInfo?.list?.map((contact) => (
            <PropertyContactRow
              type={type}
              data={contact}
              onHide={onHide}
              propertySlug={propertySlug}
              image={contactInfo?.owner?.selfie_image}
              isPropertyExpired={contactInfo?.isPropertyExpired}
              key={`contact-${contact?.assistant_mobile_number}`}
            />
          ))
        )}
      </div>
    </ModalBottomSheet>
  );
};

export default PropertyContactModal;
