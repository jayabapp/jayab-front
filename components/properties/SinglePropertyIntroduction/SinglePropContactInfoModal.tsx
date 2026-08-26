"use client";

import { usePropertyContact } from "@features/properties/hooks/usePropertyContact";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { useEffect } from "react";

import PropertyContactInfoItem from "./PropertyContactInfoItem";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import LinearSkeleton from "../ProductSkeleton/LinearSkeleton";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

type TSinglePopContact = {
  data: SinglePropDto | any;
  show: boolean;
  onHide: () => void | null;
  type: "call" | "sms" | "";
};

const SinglePropContactInfoModal = ({
  data,
  type,
  show,
  onHide,
}: TSinglePopContact) => {
  const { data: contactInfo, isPending, mutate } = usePropertyContact();

  useEffect(() => {
    if (data?.slug && show) mutate({ propertySlug: data.slug, action: "view" });
  }, [data?.slug, mutate, show]);

  return (
    <>
      <ModalBottomSheet
        options={{
          containerClass: `mx-auto rounded-t-20 absolute pb-[1.5rem] lg:pb-4 bottom-0 lg:translate-x-1/2 lg:right-1/2 w-full lg:w-[calc(35svw)]  bg-white dark:bg-zinc-900 overflow-y-scroll  dark:bg-dark-700`,
        }}
        onHide={onHide}
        show={show}
      >
        <ModalHeaderPart
          hideArrow
          onHide={onHide}
          title={_STRINGS.CONTACT_INFO}
        />

        <div className="w-full p-4 flex flex-col">
          {isPending ? (
            <div className="w-full flex flex-col gap-2">
              <LinearSkeleton width={"100%"} />
              <LinearSkeleton width={"100%"} />
            </div>
          ) : isEmpty(contactInfo) ? (
            <p className="w-full text-center">{_STRINGS?.EMPTY_CONTACT_LIST}</p>
          ) : (
            contactInfo?.list?.map((e) => (
              <PropertyContactInfoItem
                data={e}
                type={type}
                onHide={onHide}
                propertySlug={data?.slug}
                image={contactInfo?.owner?.selfie_image}
                key={`contactItem${e?.assistant_full_name}`}
                isPropertyExpired={contactInfo?.isPropertyExpired}
              />
            ))
          )}
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default SinglePropContactInfoModal;
