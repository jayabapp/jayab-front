"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@elements/Icon";

import type { PropertyReportRowProps } from "@/types/components/modules/property-details";

import PropertyReportModal from "./PropertyReportModal.client";

const PropertyReportRow = ({ propertyId }: PropertyReportRowProps) => {
  const t = useTranslations("listing");

  const [show, setShow] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShow(true)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-20 border border-line-strong px-4 py-3.5 text-start transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:px-5"
      >
        <Icon name="info" size={20} className="shrink-0 text-ink-subtle" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-semibold text-ink">
            {t("reportWrong")}
          </span>
          <span className="text-xs text-ink-subtle md:text-sm">
            {t("reportWrongDesc")}
          </span>
        </span>
        <Icon
          name="chevron-left"
          size={16}
          className="shrink-0 text-ink-subtle ltr:rotate-180"
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
