"use client";

import { useReservationCountdown } from "@features/reservations/hooks/useReservationCountdown";
import { useOwnerContactRequest } from "@features/reservations/hooks/useOwnerContactRequest";
import type { ReservationCardProps } from "@/types/components/modules/reservations";
import { useStartOrFindChat } from "@features/chat/hooks/useStartOrFindChat";
import { usePathname, useRouter } from "next/navigation";
import { Divider } from "@elements/Divider";
import { useState } from "react";

import ReservationPropertySummary from "./parts/ReservationPropertySummary";
import ReservationGuestContact from "./parts/ReservationGuestContact";
import ReservationCountdown from "./parts/ReservationCountdown";
import ReservationStatusBar from "./parts/ReservationStatusBar";
import ReservationSchedule from "./parts/ReservationSchedule";
import CmsInfoPopup from "@/components/shared/CmsInfoPopup";
import _STRINGS from "@/utils/LocalStrings";

const AWAITING_OWNER_STATUS_ID = 10;

const ReservationCard = ({
  isOwner,
  onCancel,
  reservation,
  onContactRequest,
}: ReservationCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showCounter, setShowCounter] = useState(
    reservation?.show_counter ?? false,
  );
  const [showSubscriptionNotice, setShowSubscriptionNotice] = useState(false);

  const { mutate: requestContact, isPending: isRequestingContact } =
    useOwnerContactRequest();
  const { mutate: startChat, isPending: isChatPending } = useStartOrFindChat();

  const countdown = useReservationCountdown(
    reservation?.ttl_seconds,
    !!reservation?.ttl_seconds || !!isOwner,
  );

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
    <div className="w-full shadow-card rounded-2xl justify-between flex flex-col p-3 gap-2">
      <ReservationPropertySummary isOwner={isOwner} reservation={reservation} />

      <Divider moreClass=" border-dashed  " />

      {isOwner && !showCounter ? (
        <p className="text-center text-sm">{_STRINGS.RESERVE_ANSWER_TIME_UP}</p>
      ) : !isOwner && reservation?.is_answer_deadline_passed ? (
        <p className="text-center text-sm">
          {_STRINGS.RESERVE_ANSWER_DEADLINE_PASSED}
        </p>
      ) : showCounter ? (
        <ReservationCountdown
          isOwner={isOwner}
          minutes={countdown.minutes}
          seconds={countdown.seconds}
        />
      ) : null}

      <Divider moreClass="  !border-transparent  " />

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
        />
      )}

      {!isOwner && reservation?.status?.id == AWAITING_OWNER_STATUS_ID ? (
        <>
          <Divider moreClass=" " />
          <div className="flex flex-col gap-1">
            <p className="text-center whitespace-pre-wrap text-sm">
              {_STRINGS.RESERVE_FINALIZE_NOTE}
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
          title: _STRINGS.EXTEND_SUBS,
        }}
      />
    </div>
  );
};

export default ReservationCard;
