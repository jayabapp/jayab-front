"use client";

import { useReservationCountdown } from "@features/reservations/hooks/useReservationCountdown";
import { useOwnerContactRequest } from "@features/reservations/hooks/useOwnerContactRequest";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMarkReserveSeen } from "@features/reservations/hooks/useMarkReserveSeen";
import { useStartOrFindChat } from "@features/chat/hooks/useStartOrFindChat";
import { useTranslations } from "next-intl";
import { Divider } from "@elements/Divider";

import type { ReservationCardProps } from "@/types/components/modules/reservations";

import ReservationPropertySummary from "./parts/ReservationPropertySummary";
import ReservationGuestContact from "./parts/ReservationGuestContact";
import ReservationCountdown from "./parts/ReservationCountdown";
import ReservationStatusBar from "./parts/ReservationStatusBar";
import ReservationSchedule from "./parts/ReservationSchedule";
import CmsInfoPopup from "@elements/CmsInfoPopup";

const AWAITING_OWNER_STATUS_ID = 10;

const ReservationCard = ({
  isOwner,
  onCancel,
  reservation,
  onContactRequest,
}: ReservationCardProps) => {
  const t = useTranslations();

  const router = useRouter();
  const pathname = usePathname();
  const [showCounter, setShowCounter] = useState(
    reservation?.show_counter ?? false,
  );
  const [showSubscriptionNotice, setShowSubscriptionNotice] = useState(false);

  const { mutate: requestContact, isPending: isRequestingContact } =
    useOwnerContactRequest();
  const { mutate: startChat, isPending: isChatPending } = useStartOrFindChat();
  const { mutate: markSeen } = useMarkReserveSeen();

  const countdown = useReservationCountdown(
    reservation?.ttl_seconds,
    showCounter,
  );

  useEffect(() => {
    if (!isOwner || reservation?.owner_seen_at) return;
    if (reservation?.status?.id !== AWAITING_OWNER_STATUS_ID) return;
    markSeen({ id: reservation.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, reservation?.id]);

  const onCallGuest = () => {
    if (isRequestingContact) return;
    requestContact(
      { id: reservation.id },
      {
        onSuccess: () => {
          if (reservation?.is_subscription_expired) {
            setShowSubscriptionNotice(true);
            return;
          }
          setShowCounter(false);
          window.open(
            `tel:${reservation?.guest_mobile}`,
            "_blank",
            "noopener,noreferrer",
          );
        },
      },
    );
  };

  const onStartChat = () => {
    if (isChatPending) return;
    startChat(
      { property_id: reservation?.property?.id || reservation?.property_id },
      {
        onSuccess: (response) => router.push(`/chat/${response?.chatroom_id}`),
      },
    );
  };

  const isExpired = reservation?.is_subscription_expired;

  return (
    <div className="w-full bg-surface shadow-surface rounded-2xl justify-between flex flex-col p-3 gap-2">
      <ReservationPropertySummary isOwner={isOwner} reservation={reservation} />

      <Divider moreClass=" border-dashed  " />

      {reservation?.status?.id === AWAITING_OWNER_STATUS_ID ? (
        <>
          {showCounter ? (
            <ReservationCountdown
              minutes={countdown.minutes}
              seconds={countdown.seconds}
              hint={
                isOwner
                  ? t("reserve.reserveOwnerTimeoutHint")
                  : t("reserve.reserveGuestTimeoutHint")
              }
            />
          ) : (
            <p className="text-center text-sm">
              {isOwner
                ? t("reserve.reserveAnswerTimeUp")
                : t("reserve.reserveAnswerTimeUpGuest")}
            </p>
          )}

          <Divider moreClass="  !border-transparent  " />
        </>
      ) : null}

      <ReservationSchedule isOwner={isOwner} reservation={reservation} />

      <ReservationStatusBar
        isOwner={isOwner}
        reservation={reservation}
        onCallGuest={onCallGuest}
        isRequestingContact={isRequestingContact}
        onCancel={onCancel ? () => onCancel(reservation) : undefined}
      />

      {isOwner ? null : (
        <ReservationGuestContact
          isExpired={isExpired}
          onStartChat={onStartChat}
          isChatPending={isChatPending}
          onContactRequest={onContactRequest}
          isChatEnabled={reservation?.is_chat_enabled !== false}
        />
      )}

      {!isOwner && reservation?.status?.id == AWAITING_OWNER_STATUS_ID ? (
        <>
          <Divider moreClass=" " />
          <div className="flex flex-col gap-1">
            <p className="text-center whitespace-pre-wrap text-sm">
              {t("reserve.reserveFinalizeNote")}
            </p>
          </div>
        </>
      ) : null}

      <CmsInfoPopup
        contentKey="ad-expired-content"
        show={showSubscriptionNotice}
        onHide={() => setShowSubscriptionNotice(false)}
        action={{
          href: `/profile/owner/properties/${reservation?.property?.id}/subscription?GATE_WAY_REDIRECT_URL=${pathname}`,
          title: t("common.extendSubs"),
        }}
      />
    </div>
  );
};

export default ReservationCard;
