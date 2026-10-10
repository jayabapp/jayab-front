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
        className="flex w-full cursor-pointer items-center gap-3 rounded-10 border border-line px-4 py-3 text-right transition-colors hover:bg-surface-muted"
      >
        <Icon name="info" size={20} className="shrink-0 text-ink-subtle" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-bold text-ink md:text-base">
            {t("reportWrong")}
          </span>
          <span className="text-xs text-ink-subtle md:text-sm">
            {t("reportWrongDesc")}
          </span>
        </span>
        <Icon
          name="chevron-left"
          size={16}
          className="shrink-0 text-ink-subtle"
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
