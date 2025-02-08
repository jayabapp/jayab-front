"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import Modal from "@/components/Modal";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import Checkbox from "@/components/shared/Form/Checkbox";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

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
    <Modal
      options={{
        containerClass:
          "mx-auto   my-0 mx-auto h-full md:h-auto  md:my-20 w-full md:w-1/2 xl:w-1/2 2xl:w-1/3 !rounded-0 md:rounded-2xl overflow-y-scroll bg-white dark:bg-zinc-900",
      }}
      onHide={onHide}
      show={show}
    >
      <ModalHeaderPart onHide={onHide} title={_STRINGS.PROP_TERMS} />
      <div className="w-full h-full flex flex-col items-start p-4 justify-start gap-4 bg-white   md:rounded-md">
        <p className=" text-sm font-light">{_STRINGS.PROP_TERMS_PROLUGE}</p>
        <div className="flex flex-col gap-2">
          <p className=" text-sm font-bold">{_STRINGS.CANCENLATION_DESC}</p>
          {/* <p className="text-sm">{data?.property_descriptions?.ca}</p> */}
        </div>
        <div className="flex flex-col gap-2">
          <p className=" text-sm font-bold">{_STRINGS.GUEST_TYPE_STATUS}</p>
          {data?.options?.guest_type?.map((e) => (
            <Checkbox key={`${e}checjbox`} title={e} isChecked onSelect={() => {}} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className=" text-sm font-bold">{_STRINGS.ANIMAL_RULES}</p>
          <p className="text-sm">{data?.options?.pet}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className=" text-sm font-bold">{_STRINGS.PARTY_RULES}</p>
          <p className="text-sm">{data?.options?.party}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className=" text-sm font-bold">{_STRINGS.OTHER_TERMS}</p>
          <p className="text-sm">{data?.property_descriptions?.other_dscr}</p>
        </div>
      </div>
    </Modal>
  );
};

export default PropertTermsModal;
