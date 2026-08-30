"use client";

import type { PropertyReportRowProps } from "@/types/components/modules/property-details";
import { ContentImage } from "@elements/Image";
import { useState } from "react";

import PropertyReportModal from "./PropertyReportModal.client";
import _STRINGS from "@/utils/LocalStrings";

const PropertyReportRow = ({ propertyId }: PropertyReportRowProps) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShow(true)}
        className="cursor-pointer border border-neutral-300 rounded-10 px-4 py-3 flex items-center justify-between"
      >
        <span className="text-danger-500 bg-white text-sm lg:text-base font-medium !mt-0 rounded-10 w-full text-right">
          {_STRINGS.REPORT_WRONG}
        </span>
        <ContentImage
          alt=""
          width={16}
          height={16}
          src="/assets/icons/shared/chevron.svg"
          className="object-contain transition-all w-4 aspect-square"
        />
      </button>
      {show ? (
        <PropertyReportModal
          show={show}
          propertyId={propertyId}
          onHide={() => setShow(false)}
        />
      ) : null}
    </>
  );
};

export default PropertyReportRow;
