"use client";

import { SingleSelectPopUpSelect as SinglePopUpSelect } from "@elements/Form";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { MultiLineFormInput } from "@elements/Form";
import { useReportProperty } from "@features/properties/hooks/useReportProperty";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import type { PropertyReportModalProps } from "@/types/components/modules/property-details";

import useCmsContent from "@/hooks/useCmsContent";
import Button from "@elements/Button";

const REPORT_TITLES_KEY = "reportTitles";

// Titles are one comma-separated text; Arabic editors may type "،".
const splitTitles = (content?: { small_text?: string; full_text?: string }) =>
  (content?.small_text || content?.full_text || "")
    .split(/[,،]/)
    .map((title) => title.trim())
    .filter(Boolean);

const PropertyReportModal = ({
  show,
  onHide,
  propertyId,
}: PropertyReportModalProps) => {
  const t = useTranslations("listing");
  const locale = useLocale();

  const [reportTitle, setReportTitle] = useState<string | number>("");
  const [report, setReport] = useState("");

  const { mutate, isPending } = useReportProperty();
  const { content: reportTitles } = useCmsContent(REPORT_TITLES_KEY, {
    enabled: show,
  });
  // Admins read reports in Persian, so the submitted title is always the Persian entry.
  const { content: persianTitles } = useCmsContent(REPORT_TITLES_KEY, {
    enabled: show && locale !== "fa",
    locale: "fa",
  });

  const labels = splitTitles(reportTitles);
  const values = locale === "fa" ? labels : splitTitles(persianTitles);
  const hasPairs = values.length === labels.length;

  const onClose = () => {
    onHide();
    setReport("");
    setReportTitle("");
  };

  return (
    <ModalBottomSheet
      show={show}
      onHide={onClose}
      options={{
        parentClass: "items-center",
        containerClass: "md:w-[32rem]",
      }}
    >
      <ModalHeaderPart hideArrow onHide={onClose} title={t("reportAdd")} />

      <div className="w-full flex flex-col items-center justify-center gap-4 px-6 py-4">
        <SinglePopUpSelect
          closeOnSelect
          value={reportTitle}
          onSelect={setReportTitle}
          item={{
            placeholder: t("reportTitle"),
            containerClass: "w-full",
            inputClass: " w-full bg-secondary-100/30!",
            list: labels.map((title, index) => ({
              id: hasPairs ? values[index] : title,
              title,
            })),
          }}
        />

        <MultiLineFormInput
          value={report}
          onChangeText={setReport}
          item={{
            rows: 4,
            containerClass: "w-full",
            placeholder: t("yourReport"),
            inputClass: "bg-secondary-100/30! w-full",
          }}
        />

        <Button
          color="danger"
          loading={isPending}
          disabled={!reportTitle}
          containerClass="w-full"
          width="w-full !text-white"
          title={t("submitReport")}
          onClick={() =>
            mutate(
              {
                description: report,
                title: `${reportTitle}`,
                post_id: propertyId,
              },
              { onSuccess: onClose },
            )
          }
        />
      </div>
    </ModalBottomSheet>
  );
};

export default PropertyReportModal;
