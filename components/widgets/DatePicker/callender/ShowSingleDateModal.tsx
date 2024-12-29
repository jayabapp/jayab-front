import React, { useEffect, useState } from "react";
import Modal from "../../../Modal";
import { useStoreTheme } from "../../../../store";
import moment from "moment-jalaali";
import Button from "../../../Button/Button";
import _STRINGS from "../../../../../../utils/LocalStrings";
import QueueIcon from "../../../DynamicIcons/QueueIcon";
import { ChangeVarityIcon } from "../../../IconsMerchant";
import FormInput from "../../../Form/FormInput";
import { SingleCallenderDateDetail } from "@repo/api/dto/shared.dto";
import coushion from "../../../../../public/assets/icons/status/coushion.svg";
import v_sign from "../../../../../public/assets/icons/status/v_sign.svg";
import startOfDate from "../../../../exportable-helpers/StartOfDate";
const ShowSingleDateModal = ({
  show,
  onHide,
  selectedDate,
  callBack,
  type = "MANAGER",
  data,
  onSubmitCallBack,
}: {
  type?: "EMPLOYEE" | "MANAGER";
  show: boolean;
  onHide: () => void;
  callBack: () => void;
  onSubmitCallBack?: (note: string, is_off_day: boolean, date: Date) => void;
  selectedDate?: string | number;
  data?: SingleCallenderDateDetail;
}) => {
  const { color } = useStoreTheme((state) => state);
  const [memo, setMemo] = useState("");
  const [isOff, setIsOff] = useState(false);

  useEffect(() => {
    if (!!data) {
      setMemo(data?.note);
      setIsOff(data?.is_off_day);
    }
    return () => {
      setMemo("");
    };
  }, [data]);

  return (
    <Modal show={show} onHide={onHide}>
      <div className=" w-full p-4 flex flex-col gap-2">
        <div className="flex flex-col gap-1 border-b pb-2 items-start">
          <p style={{ color: color }}>{moment(selectedDate, "jYYYY/jMM/jDD").format("jYYYY")}</p>
          <p className=" text-2xl " style={{ color: color }}>
            {moment(selectedDate, "jYYYY/jMM/jDD").format("   ddd jDD jMMMM")}
          </p>
        </div>
        {!!data?.has_time_sheet ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between w-full">
              {!!data?.is_off_day ? (
                <div className="flex items-center gap-2">
                  {" "}
                  <img src={coushion?.src} className="w-5 h-5 aspect-square" />
                  <p className="text-xl  text-red-800">{_STRINGS.HOLIDAY}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {" "}
                  <img src={v_sign?.src} className="w-5 h-5 aspect-square" />{" "}
                  <p className="text-xl  text-emerald-500">{_STRINGS.WORK_DAY}</p>{" "}
                </div>
              )}
              {type == "EMPLOYEE" ? (
                <Button
                  onClick={() => {
                    setIsOff((e) => !e);
                  }}
                  title={!!isOff ? _STRINGS.CHANGE_TO_WORK_DAY : _STRINGS.CHANGE_TO_OFF_DAY}
                  icon={<ChangeVarityIcon color="white" className="ml-2" />}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}

        {type == "EMPLOYEE" ? (
          <div className="w-full relative">
            {" "}
            <FormInput
              item={{
                containerClass: " mt-4",
                title: _STRINGS.TODAYS_MEMO,
                placeholder: _STRINGS.YOUR_TEXT,
                multiline: true,
                rows: 4,
              }}
              value={memo}
              onChangeText={(e) => {
                setMemo(e);
              }}
            />
            <Button
              onClick={() => {
                if (!!onSubmitCallBack)
                  onSubmitCallBack(memo || "", !!isOff, startOfDate(moment(selectedDate, "jYYYY/jMM/jDD").toDate()));
              }}
              width=" md:!py-1  !text-sm md:!text-sm"
              containerClass=" absolute left-2 bottom-6"
              title={_STRINGS.SAVE}
            />
          </div>
        ) : (
          <></>
        )}

        <Button
          onClick={callBack}
          title={_STRINGS.C_DAYS_RESERVATIONS}
          variant="white"
          width="!rounded-10  !p-2 md:!p-3  !w-[70%]"
          containerClass=" w-full flex items-center justify-center"
          icon={<QueueIcon className="ml-2" />}
        />
      </div>
    </Modal>
  );
};

export default ShowSingleDateModal;
