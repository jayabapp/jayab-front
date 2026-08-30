"use client";

import { useDeleteOwnerProperty } from "@features/owner-property/hooks/useDeleteOwnerProperty";
import type { OwnerPropertyViewProps } from "@/types/components/modules/owner-property";
import { usePropertyBadge } from "@features/owner-property/hooks/usePropertyBadge";
import { ContentImage } from "@elements/Image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import OwnerCommissionAllDaysModal from "./parts/OwnerCommissionAllDaysModal.client";
import OwnerBadgeRequestModal from "./parts/OwnerBadgeRequestModal.client";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import OwnerActionRow from "./parts/OwnerActionRow";
import _STRINGS from "@/utils/LocalStrings";

const BADGE_PENDING_STATUS_ID = 100;

const OwnerPropertyActions = ({ property }: OwnerPropertyViewProps) => {
  const router = useRouter();
  const [showBadgeRequest, setShowBadgeRequest] = useState(false);
  const [showCommission, setShowCommission] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { data: badge } = usePropertyBadge(property?.id ?? "");
  const { mutate, isPending } = useDeleteOwnerProperty();

  const onDeleteConfirm = () => {
    if (isPending) return;
    mutate(
      { propertyId: property?.id },
      { onSuccess: () => router.replace("/profile/owner/properties") },
    );
  };

  const base = `/profile/owner/properties/${property?.id}`;

  return (
    <div className="w-full flex order-5 flex-col gap-4">
      <OwnerActionRow
        title={_STRINGS.PROP_STATS}
        href={`${base}/subscription`}
      />
      <OwnerActionRow
        title={_STRINGS.CHANGE_ADVISOR_COMMISSION}
        onClick={() => setShowCommission(true)}
      />
      <OwnerActionRow
        title={_STRINGS.AUTHORiZIATION_REQUEST}
        href={`${base}/license`}
      />
      <OwnerActionRow
        title={_STRINGS.REQUEST_FOR_BADGE}
        onClick={() => setShowBadgeRequest(true)}
        badge={
          badge?.status?.id == BADGE_PENDING_STATUS_ID ? (
            <ContentImage
              alt=""
              width={16}
              height={16}
              className="w-4 h-4 aspect-square"
              src="/assets/icons/property/request_badge.svg"
            />
          ) : null
        }
      />
      <OwnerActionRow title={_STRINGS.EDIT_INFO} href={`${base}/edit`} />
      <OwnerActionRow
        tone="brand"
        href={`${base}/inquery`}
        title={_STRINGS.WEEKLY_INQUERY}
        icon={
          <ContentImage
            alt=""
            width={24}
            height={24}
            className="w-6 h-6 aspect-square"
            src="/assets/icons/property/police_speaker.svg"
          />
        }
      />
      <OwnerActionRow
        tone="danger"
        onClick={() => setShowDelete(true)}
        title={_STRINGS.ARE_U_SURE_DELETE_PROPERTY_TITLE}
      />

      <OwnerCommissionAllDaysModal
        property={property}
        show={showCommission}
        onHide={() => setShowCommission(false)}
      />
      <OwnerBadgeRequestModal
        badge={badge}
        property={property}
        show={showBadgeRequest}
        onHide={() => setShowBadgeRequest(false)}
      />
      <ConfirmModal
        isLoading={isPending}
        isVisible={!!showDelete}
        onConfirm={onDeleteConfirm}
        onHide={() => setShowDelete(false)}
        messageClass=" !text-black !text-base"
        text={_STRINGS.ARE_U_SURE_DELETE_PROPERTY}
        hideTextClassName=" border !bg-white !rounded-full "
        headerImage="/assets/images/shared/red_crossed_sheet.png"
        confirmTextClassName=" !bg-danger-500 text-white !rounded-full "
      />
    </div>
  );
};

export default OwnerPropertyActions;
