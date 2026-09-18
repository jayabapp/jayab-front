"use client";

import type { CancellationSummaryProps } from "@/types/components/modules/property-details";
import { useContentList } from "@features/home/hooks/useContentList";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { useState } from "react";

import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@elements/CmsText";

const PROPERTY_RULES_KEY = "propertyRules";

const CHIP_CLASS: Record<string, string> = {
  EASY: "bg-success-50 text-success-600",
  NORMAL: "bg-warning-50 text-warning-600",
  STRICT: "bg-danger-50 text-danger-500",
};

const CancellationSummary = ({ cancelingType }: CancellationSummaryProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { items } = useContentList(
    { key: PROPERTY_RULES_KEY, page: 1 },
    showDetails,
  );
  const rule = items.find((item) => item?.key === cancelingType?.id);
  if (!cancelingType?.title) return <></>;
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-neutral-900">
          {_STRINGS.CANCENLATION_DESC}
        </p>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            CHIP_CLASS[cancelingType.id] ?? "bg-neutral-100 text-neutral-700"
          }`}
        >
          {cancelingType.title}
        </span>
        <button
          type="button"
          onClick={() => setShowDetails(true)}
          className="cursor-pointer text-sm font-semibold text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {_STRINGS.CANCELLATION_DETAILS}
        </button>
      </div>

      <ModalBottomSheet
        show={showDetails}
        onHide={() => setShowDetails(false)}
        options={{ containerClass: "md:w-[34rem]" }}
      >
        <ModalHeaderPart
          hideArrow
          title={_STRINGS.CANCENLATION_DESC}
          onHide={() => setShowDetails(false)}
        />
        <div className="p-4">
          <CmsText className="content text-justify text-sm leading-7 text-neutral-800">
            {rule?.small_text}
          </CmsText>
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default CancellationSummary;
