import { HomeService } from "@/api_services/home/home.service";
import { PropertyService } from "@/api_services/property/property.service";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import Button from "@/components/shared/Button/Button";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import SinglePopUpSelect from "@/components/shared/Form/SingleSelectPopUpSelect";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const ReportPop = ({ show, setShow, postId }: { postId: number; show: boolean; setShow: (value: boolean) => void }) => {
  const [reportTitle, setReportTitle] = useState<any>("");
  const [report, setReport] = useState("");
  const onHide = () => {
    setShow(false);

    setReport("");
    setReportTitle("");
  };

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.reportPost,
    onSuccess: () => {
      onHide();
    },
  });

  const onSubmit = () => {
    mutate({ description: report, title: reportTitle, post_id: postId });
  };

  /* -------------------------------------------------------------------------- */
  /*                                REPORT TITLES                               */
  /* -------------------------------------------------------------------------- */

  const { data: reportTitles, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "reportTitles", 1, show],
    queryFn: () => {
      if (show) return HomeService.GetContentByKey({ key: "reportTitles" });
      else return null;
    },
  });
  return (
    <ModalBottomSheet show={show} onHide={onHide}>
      <ModalHeaderPart hideArrow onHide={onHide} title={_STRINGS.REPORT_ADD} />

      <div className=" w-full flex flex-col items-center justify-center  gap-4             px-6 py-4 ">
        <SinglePopUpSelect
          value={reportTitle}
          onSelect={(e) => {
            setReportTitle(e);
          }}
          item={{
            list:
              (reportTitles?.small_text || reportTitles?.full_text)?.split(",")?.map((e) => ({ id: e, title: e })) ||
              [],

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
          title={_STRINGS.SUBMIT_REPORT}
          onClick={onSubmit}
          loading={isPending}
          containerClass="w-full "
          width="w-full !text-white "
          color="danger"
        />
      </div>
    </ModalBottomSheet>
  );
};

export default ReportPop;
