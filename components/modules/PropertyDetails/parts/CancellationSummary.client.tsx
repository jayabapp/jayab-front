"use client";

import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { useTranslations } from "next-intl";
import { useContentList } from "@features/home/hooks/useContentList";
import { useState } from "react";

import type * as T from "@/types/components/modules/property-details";

import CmsText from "@elements/CmsText";

const PROPERTY_RULES_KEY = "propertyRules";

const CHIP_CLASS: Record<string, string> = {
  EASY: "bg-status-success-bg text-status-success",
  NORMAL: "bg-status-warning-bg text-status-warning",
  STRICT: "bg-status-danger-bg text-status-danger",
};

const TIMELINE_COLORS: T.TTimelineColor[] = ["success", "warning", "danger"];

const COLOR_CLASSES: Record<
  T.TTimelineColor,
  {
    border: string;
    line: string;
    text: string;
  }
> = {
  success: {
    border: "border-status-success",
    line: "bg-success-500",
    text: "text-status-success",
  },
  warning: {
    border: "border-warning-500",
    line: "bg-warning-500",
    text: "text-status-warning",
  },
  danger: {
    border: "border-status-danger",
    line: "bg-danger-500",
    text: "text-status-danger",
  },
};

const parseCancellationPolicy = (text?: string | null): T.TParsedPolicy => {
  if (!text?.trim()) {
    return {
      description: undefined,
      steps: [],
    };
  }

  const normalizedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  const blocks = normalizedText
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length >= 2) {
    const [description, ...stepBlocks] = blocks;

    const steps = stepBlocks.map((block, index) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const [title, ...descriptionLines] = lines;
      return {
        title,
        description: descriptionLines.join("\n") || undefined,
        color: TIMELINE_COLORS[Math.min(index, TIMELINE_COLORS.length - 1)],
      };
    });
    return {
      description,
      steps,
    };
  }

  const lines = normalizedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    description: undefined,
    steps: lines.map((line, index) => ({
      title: line,
      color: TIMELINE_COLORS[Math.min(index, TIMELINE_COLORS.length - 1)],
    })),
  };
};

const StepMarker = ({ color, index }: T.TStepMarkerProps) => {
  const classes = COLOR_CLASSES[color];

  return (
    <span
      className={[
        "relative z-10 flex size-8 shrink-0",
        "items-center justify-center rounded-full",
        "border-2 bg-surface",
        classes.border,
        classes.text,
      ].join(" ")}
      aria-hidden="true"
    >
      {index === 0 ? (
        <svg viewBox="0 0 24 24" fill="none" className="size-4">
          <path
            d="M7 12.5L10.2 15.5L17 8.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : index === 2 ? (
        <svg viewBox="0 0 24 24" fill="none" className="size-[18px]">
          <path
            d="M4.5 10.2L12 4L19.5 10.2V18.5C19.5 19.05 19.05 19.5 18.5 19.5H5.5C4.95 19.5 4.5 19.05 4.5 18.5V10.2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M9 19.5V14H15V19.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span className="size-2 rounded-full bg-current" />
      )}
    </span>
  );
};

const CancellationSummary = ({ cancelingType }: T.CancellationSummaryProps) => {
  const t = useTranslations("listing");

  const [showDetails, setShowDetails] = useState(false);
  const { items } = useContentList(
    {
      key: PROPERTY_RULES_KEY,
      page: 1,
    },
    showDetails,
  );
  if (!cancelingType?.title) return null;
  const rule = items.find((item) => item?.key === cancelingType.id);
  const policyText = rule?.full_text || rule?.small_text || "";
  const parsedPolicy = parseCancellationPolicy(policyText);
  const timelineSteps =
    parsedPolicy.steps.length > 0
      ? parsedPolicy.steps
      : [
          {
            title: t("cancellationRuleFallback"),
            color: "warning" as const,
          },
        ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <p className="ui-body font-semibold text-ink">
          {t("cancenlationDesc")}
        </p>
        <span
          className={[
            "rounded-full px-2.5 py-0.5",
            "text-xs font-semibold",
            CHIP_CLASS[cancelingType.id] ?? "bg-surface-muted text-ink-muted",
          ].join(" ")}
        >
          {cancelingType.title}
        </span>

        <button
          type="button"
          onClick={() => setShowDetails(true)}
          className={[
            "cursor-pointer text-sm font-semibold text-link",
            "transition-colors hover:text-on-selected",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-focus",
            "focus-visible:ring-offset-2",
          ].join(" ")}
        >
          {t("cancellationDetails")}
        </button>
      </div>

      <ModalBottomSheet
        show={showDetails}
        onHide={() => setShowDetails(false)}
        options={{
          containerClass: "md:w-[38rem]",
        }}
      >
        <ModalHeaderPart
          hideArrow
          title={t("cancenlationDesc")}
          onHide={() => setShowDetails(false)}
        />

        <div className="px-5 pb-7 pt-3 md:px-7 md:pb-8">
          {/* Policy type */}
          <h3 className="text-lg font-bold leading-8 text-ink md:text-xl">
            {cancelingType.title}
          </h3>

          {/* Main policy description */}
          {parsedPolicy.description ? (
            <CmsText
              as="p"
              whitespace="pre-wrap"
              className="mt-3 text-sm leading-7 text-ink-muted md:text-base md:leading-8"
            >
              {parsedPolicy.description}
            </CmsText>
          ) : null}

          {/* Timeline */}
          <ol className="mt-7 flex flex-col">
            {timelineSteps.map((step, index) => {
              const isLast = index === timelineSteps.length - 1;
              const nextColor = timelineSteps[index + 1]?.color;

              return (
                <li
                  key={`${step.title}-${index}`}
                  className="relative flex items-stretch gap-4"
                >
                  {/* Stepper */}
                  <div className="relative flex w-8 shrink-0 flex-col items-center">
                    <StepMarker index={index} color={step.color} />
                    {!isLast ? (
                      <div
                        className="flex min-h-20 flex-1 flex-col items-center"
                        aria-hidden="true"
                      >
                        <span
                          className={[
                            "w-[3px] flex-1",
                            COLOR_CLASSES[step.color].line,
                          ].join(" ")}
                        />

                        <span
                          className={[
                            "w-[3px] flex-1",
                            nextColor
                              ? COLOR_CLASSES[nextColor].line
                              : COLOR_CLASSES[step.color].line,
                          ].join(" ")}
                        />
                      </div>
                    ) : null}
                  </div>

                  {/* Step content */}
                  <div
                    className={[
                      "min-w-0 flex-1",
                      isLast ? "pb-0" : "pb-8 md:pb-10",
                    ].join(" ")}
                  >
                    <h4 className="text-base font-bold leading-7 text-ink md:text-lg md:leading-8">
                      {step.title}
                    </h4>

                    {step.description ? (
                      <div className="mt-2 flex items-start gap-2.5">
                        <span
                          className="mt-[11px] size-1.5 shrink-0 rounded-full bg-neutral-500"
                          aria-hidden="true"
                        />

                        <CmsText
                          as="p"
                          whitespace="pre-wrap"
                          className="min-w-0 text-sm leading-7 text-ink-muted md:text-base md:leading-8"
                        >
                          {step.description}
                        </CmsText>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default CancellationSummary;
