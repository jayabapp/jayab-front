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

/**
 * The cancellation policy has no structured time-window/percentage data
 * anywhere in the API: `canceling_type` on the property is only
 * `{ id, title }` and the matching CMS `propertyRules` item is free-text
 * (`small_text`/`full_text`). So the real policy text is rendered as a
 * timeline, one step per non-empty line, in the order the CMS author wrote
 * it — no percentage or deducted amount is invented here.
 */
const buildTimelineSteps = (text?: string | null) =>
  (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const CancellationSummary = ({ cancelingType }: CancellationSummaryProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { items } = useContentList(
    { key: PROPERTY_RULES_KEY, page: 1 },
    showDetails,
  );
  const rule = items.find((item) => item?.key === cancelingType?.id);
  const steps = buildTimelineSteps(rule?.small_text || rule?.full_text);
  const timelineSteps = steps.length ? steps : [_STRINGS.CANCELLATION_RULE_FALLBACK];
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
          <ol className="flex flex-col">
            {timelineSteps.map((step, index) => (
              <li key={index} className="relative flex gap-3 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                    {index + 1}
                  </span>
                  {index < timelineSteps.length - 1 ? (
                    <span className="mt-1 w-px flex-1 bg-neutral-200" />
                  ) : null}
                </div>
                <CmsText
                  as="p"
                  whitespace="pre-wrap"
                  className="pt-0.5 text-sm leading-7 text-neutral-800"
                >
                  {step}
                </CmsText>
              </li>
            ))}
          </ol>
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default CancellationSummary;
