"use client";

import type { PropertyReportModalProps } from "@/types/components/modules/property-details";
import { useReportProperty } from "@features/properties/hooks/useReportProperty";
import { SingleSelectPopUpSelect as SinglePopUpSelect } from "@elements/Form";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { MultiLineFormInput } from "@elements/Form";
import { useState } from "react";

import useCmsContent from "@/hooks/useCmsContent";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const REPORT_TITLES_KEY = "reportTitles";

const PropertyReportModal = ({
  show,
  onHide,
  propertyId,
}: PropertyReportModalProps) => {
  const [reportTitle, setReportTitle] = useState<string | number>("");
  const [report, setReport] = useState("");

  const { mutate, isPending } = useReportProperty();
  const { content: reportTitles } = useCmsContent(REPORT_TITLES_KEY, {
    enabled: show,
  });

  const onClose = () => {
    onHide();
    setReport("");
    setReportTitle("");
  };

  return (
    <ModalBottomSheet show={show} onHide={onClose}>
      <ModalHeaderPart hideArrow onHide={onClose} title={_STRINGS.REPORT_ADD} />

      <div className="w-full flex flex-col items-center justify-center gap-4 px-6 py-4">
        <SinglePopUpSelect
          closeOnSelect
          value={reportTitle}
          onSelect={setReportTitle}
          item={{
            placeholder: _STRINGS.REPORT_TITLE,
            containerClass: "w-full",
            inputClass: " w-full bg-secondary-100/30!",
            list:
              (reportTitles?.small_text || reportTitles?.full_text)
                ?.split(",")
                ?.map((title) => ({ id: title, title })) || [],
          }}
        />

        <MultiLineFormInput
          value={report}
          onChangeText={setReport}
          item={{
            rows: 4,
            containerClass: "w-full",
            placeholder: _STRINGS.YOUR_REPORT,
            inputClass: "bg-secondary-100/30! w-full",
          }}
        />

        <Button
          color="danger"
          loading={isPending}
          containerClass="w-full"
          width="w-full !text-white"
          title={_STRINGS.SUBMIT_REPORT}
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
