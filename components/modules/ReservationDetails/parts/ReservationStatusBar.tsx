import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { ReservationStatusBarProps } from "@/types/components/modules/reservations";

import StatusShower from "@elements/StatusShower";
import Button from "@elements/Button";

const AWAITING_OWNER_STATUS_ID = 10;
const ANSWERED_STATUS_ID = 20;

// The backend sends fixed Persian titles; the status id picks the localized one.
const STATUS_TITLE_KEYS = {
  10: "statusPending",
  20: "statusCanceledByUser",
  30: "statusOwnerCalled",
} as const;

const ReservationStatusBar = ({
  isOwner,
  onCancel,
  reservation,
  onCallGuest,
  isRequestingContact,
}: ReservationStatusBarProps) => {
  const t = useTranslations("reserve");

  const guestMobile = `${reservation?.guest_mobile}`;
  const isMasked = guestMobile.includes("*");
  const status = reservation?.status;
  const titleKey =
    STATUS_TITLE_KEYS[Number(status?.id) as keyof typeof STATUS_TITLE_KEYS];
  // Same rule as the backend: guests see "seen" once the host called them.
  const seenByHost =
    !isOwner &&
    status?.id === AWAITING_OWNER_STATUS_ID &&
    Number(reservation?.owner_clicked_guest_mobile) > 0;

  return (
    <div className="w-full flex flex-col gap-2">
      {isOwner && reservation?.status?.id == AWAITING_OWNER_STATUS_ID ? (
        <p className="text-center text-sm">{t("guestAwaitsYou")}</p>
      ) : null}

      <div className="flex items-center justify-between">
        <StatusShower
          data={
            status && titleKey
              ? {
                  ...status,
                  title: t(seenByHost ? "statusOwnerCalled" : titleKey),
                }
              : status
          }
        />

        {!isOwner && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer bg-surface-muted border w-fit flex items-center gap-2 px-3 py-2 rounded-xl text-2xs md:text-sm font-medium"
          >
            {t("cancelReserve")}
            <ContentImage
              alt=""
              width={8}
              height={8}
              src="/assets/icons/adds/x_mark.svg"
              className="w-2 h-2 md:w-2 cursor-pointer opacity-60 md:h-2"
            />
          </button>
        ) : isOwner && reservation?.status?.id != ANSWERED_STATUS_ID ? (
          <Button
            width="!py-1"
            onClick={onCallGuest}
            loading={isRequestingContact}
            disabled={isRequestingContact}
            title={isMasked ? t("callTheGuest") : guestMobile}
            icon={
              <ContentImage
                alt=""
                width={16}
                height={16}
                className="w-4 h-4 aspect-square"
                src="/assets/icons/advisor/white_phone.svg"
              />
            }
          />
        ) : null}
      </div>
    </div>
  );
};

export default ReservationStatusBar;
