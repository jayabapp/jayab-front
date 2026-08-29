import { useReportProperty } from "@features/properties/hooks/useReportProperty";
import { useState } from "react";

import { MultiLineFormInput } from "@elements/Form";
import { SingleSelectPopUpSelect as SinglePopUpSelect } from "@elements/Form";
import { ModalBottomSheet } from "@elements/Modal";
import { ModalHeaderPart } from "@elements/Modal";
import useCmsContent from "@/hooks/useCmsContent";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

type TReportPop = {
  show: boolean;
  postId: number;
  setShow: (value: boolean) => void;
};

const ReportPop = ({ show, setShow, postId }: TReportPop) => {
  const [reportTitle, setReportTitle] = useState<any>("");
  const [report, setReport] = useState("");
  const onHide = () => {
    setShow(false);

    setReport("");
    setReportTitle("");
  };

  const { mutate, isPending } = useReportProperty();

  const onSubmit = () => {
    mutate(
      { description: report, title: reportTitle, post_id: postId },
      { onSuccess: onHide },
    );
  };

  const { content: reportTitles } = useCmsContent("reportTitles", {
    enabled: !!show,
  });
  return (
    <ModalBottomSheet show={show} onHide={onHide}>
      <ModalHeaderPart hideArrow onHide={onHide} title={_STRINGS.REPORT_ADD} />

      <div className="w-full flex flex-col items-center justify-center gap-4 px-6 py-4 ">
        <SinglePopUpSelect
          value={reportTitle}
          onSelect={(e) => {
            setReportTitle(e);
          }}
          item={{
            list:
              (reportTitles?.small_text || reportTitles?.full_text)
                ?.split(",")
                ?.map((e) => ({ id: e, title: e })) || [],

            placeholder: _STRINGS.REPORT_TITLE,
            containerClass: "w-full",

            inputClass: " w-full bg-secondary-100/30!",
          }}
          closeOnSelect
        />

        <MultiLineFormInput
          value={report}
          onChangeText={(e) => {
            setReport(e);
          }}
          item={{
            rows: 4,
            placeholder: _STRINGS.YOUR_REPORT,
            inputClass: "bg-secondary-100/30! w-full",
            containerClass: "w-full",
          }}
        />

        <Button
          color="danger"
          onClick={onSubmit}
          loading={isPending}
          containerClass="w-full "
          width="w-full !text-white "
          title={_STRINGS.SUBMIT_REPORT}
        />
      </div>
    </ModalBottomSheet>
  );
};

export default ReportPop;
