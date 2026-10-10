"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import type { AdvisorSubscriptionStatusProps } from "@/types/components/modules/advisors";

import StatusShower from "@elements/StatusShower";
import Button from "@elements/Button";
import moment from "moment-jalaali";

const EDITABLE_STATUS_ID = 10;

const AdvisorSubscriptionStatus = ({
  plans,
  profile,
  onCancel,
}: AdvisorSubscriptionStatusProps) => {
  const t = useTranslations();

  const router = useRouter();
  const expiresAt = profile?.subscription_expired_at;
  const isActive = moment().isBefore(expiresAt);
  const planTitle = plans?.find((plan) =>
    profile?.is_special ? !!plan?.is_special : !plan?.is_special,
  )?.title;

  return (
    <div className="w-full flex flex-col items-start justify-between gap-2">
      <div className="flex items-start flex-row justify-between w-full gap-4">
        <p className="text-sm">
          {t("advisor.yourPlan")} : {planTitle}
        </p>
        <StatusShower data={profile?.status} />
      </div>

      {!expiresAt || !isActive ? (
        <p className="text-status-danger text-sm">{t("advisor.noActiveSub")}</p>
      ) : (
        <div className="flex items-center gap-2 justify-between w-full flex-row">
          <p className="text-sm">{t("advisor.remainingCreditDays")} :</p>
          <div className="rounded-full text-xs md:text-sm text-link bg-selected flex items-center justify-center h-5 md:h-6 w-16 md:w-20">
            {`${t("common.days", { count: Number(moment(expiresAt).diff(moment(), "days")) })}`}
          </div>
        </div>
      )}

      <div className="flex flex-row w-full items-center gap-2">
        <div className="flex items-center gap-2">
          {profile?.status?.id == EDITABLE_STATUS_ID ? (
            <Button
              color="light"
              variant="outline"
              containerClass="w-fit "
              title={t("common.editInfo")}
              width=" !py-1 !px-3  !text-xs "
              onClick={() =>
                router.push(
                  `/profile/advisor/subscription/${profile?.is_special ? "is-especial" : "normal"}`,
                )
              }
            />
          ) : null}
        </div>
        {profile?.is_special ? (
          <Button
            color="danger"
            variant="outline"
            onClick={onCancel}
            containerClass="w-fit "
            title={t("advisor.endConsultSub")}
            width="  !py-0.5 md:!py-1 !px-2 md:!px-3  !text-xs "
          />
        ) : null}
      </div>
    </div>
  );
};

export default AdvisorSubscriptionStatus;
