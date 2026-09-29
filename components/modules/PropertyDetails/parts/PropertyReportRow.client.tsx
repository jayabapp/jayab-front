"use client";

import type { PropertyReportRowProps } from "@/types/components/modules/property-details";
import { Icon } from "@elements/Icon";
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
        className="flex w-full cursor-pointer items-center gap-3 rounded-10 border border-neutral-200 px-4 py-3 text-right transition-colors hover:bg-neutral-50"
      >
        <Icon name="info" size={20} className="shrink-0 text-neutral-500" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-bold text-neutral-900 md:text-base">
            {_STRINGS.REPORT_WRONG}
          </span>
          <span className="text-xs text-neutral-500 md:text-sm">
            {_STRINGS.REPORT_WRONG_DESC}
          </span>
        </span>
        <Icon
          name="chevron-left"
          size={16}
          className="shrink-0 text-neutral-400"
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
