import type { PaymentCardProps } from "@/types/components/modules/profile";
import { Divider } from "@elements/Divider";

import numberWithCommas from "@/helpers/numberWithCommas";
import LinearData from "@/components/LinearDataShowCase";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";

const PaymentCard = ({ payment }: PaymentCardProps) => (
  <div className="shadow-card flex flex-col rounded-10 p-4 gap-4">
    <LinearData
      disableDash
      title={_STRINGS.TITLE}
      value={`${payment?.title}`}
    />
    <Divider />
    <LinearData
      disableDash
      title={_STRINGS.SERVICE_TYPE}
      value={`${payment?.type}`}
    />
    <Divider />
    <LinearData
      disableDash
      title={_STRINGS.COST}
      value={`${numberWithCommas(payment?.price)} ${_STRINGS.TOMAN}`}
    />
    <Divider />
    <LinearData
      disableDash
      title={_STRINGS.PAYMENT_TIME}
      value={`${moment(payment?.created_at).format(" jD jMMMM  jYYYY  -  HH:mm")}`}
    />
    <Divider />
    <LinearData
      disableDash
      title={_STRINGS.STATUS}
      value={`${payment?.status?.title}`}
    />
    {payment?.description ? (
      <>
        <Divider />
        <p className="text-sm">{payment.description}</p>
      </>
    ) : null}
  </div>
);

export default PaymentCard;
