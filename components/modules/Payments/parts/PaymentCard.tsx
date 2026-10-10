import { useTranslations } from "next-intl";
import { Divider } from "@elements/Divider";

import type { PaymentCardProps } from "@/types/components/modules/profile";

import numberWithCommas from "@/helpers/numberWithCommas";
import LinearData from "@elements/LinearDataList";
import moment from "moment-jalaali";

const PaymentCard = ({ payment }: PaymentCardProps) => {
  const t = useTranslations();

  return (
  <div className="shadow-surface flex flex-col rounded-10 p-4 gap-4">
    <LinearData
      disableDash
      title={t("profile.title")}
      value={`${payment?.title}`}
    />
    <Divider />
    <LinearData
      disableDash
      value={`${payment?.type}`}
      title={t("profile.serviceType")}
    />
    <Divider />
    <LinearData
      disableDash
      title={t("common.cost")}
      value={`${numberWithCommas(payment?.price)} ${t("common.toman")}`}
    />
    <Divider />
    <LinearData
      disableDash
      title={t("profile.paymentTime")}
      value={`${moment(payment?.created_at).format(" jD jMMMM  jYYYY  -  HH:mm")}`}
    />
    <Divider />
    <LinearData
      disableDash
      title={t("profile.status")}
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
};

export default PaymentCard;
