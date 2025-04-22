import React from "react";
import LinearData from "../LinearDataShowCase";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import { SubPaymentsDto } from "@/api_services/user/user.interface";
import moment from "moment-jalaali";
import { Divider } from "../shared/Divider";

const MyPaymentCards = ({ data }: { data: SubPaymentsDto }) => {
  return (
    <div className=" shadow-card  flex flex-col rounded-10 p-4 gap-4">
      <LinearData disableDash title="عنوان" value={`${data?.title} `} containerClassName="      " />
      <Divider />
      <LinearData disableDash title="نوع سرویس" value={`${data?.type} `} containerClassName="      " />
      <Divider />
      <LinearData
        disableDash
        title="هزینه"
        value={`${numberWithCommas(data?.price)} ${_STRINGS.TOMAN} `}
        containerClassName="      "
      />
      <Divider />
      <LinearData
        disableDash
        title="زمان پرداخت"
        value={`${moment(data?.created_at).format(" jD jMMMM  jYYYY  -  HH:mm")} `}
        containerClassName="      "
      />
      <Divider />
      <LinearData disableDash title="وضعیت" value={`${data?.status?.title} `} containerClassName="      " />
      {!!data?.description ? (
        <>
          <Divider />
          <p className="  text-sm"> {data?.description}</p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyPaymentCards;
