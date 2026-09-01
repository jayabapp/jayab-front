"use client";

import type { OwnerBadgeRequestModalProps } from "@/types/components/modules/owner-property";
import { usePropertyBadge } from "@features/owner-property/hooks/usePropertyBadge";
import { ContentImage } from "@elements/Image";

import SkeletonText from "@elements/Skeleton/SkeletonText";
import useCmsContent from "@/hooks/useCmsContent";
import StatusShower from "@elements/StatusShower";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@elements/CmsText";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

const OwnerBadgeRequestModal = ({
  show,
  badge,
  onHide,
  property,
}: OwnerBadgeRequestModalProps) => {
  const {
    request: { mutate, isPending },
  } = usePropertyBadge(property?.id ?? "");

  const onRequest = () => {
    if (!property?.id || isPending) return;
    mutate({ property_id: property.id }, { onSuccess: onHide });
  };

  const { content: badgeContent, isLoading } = useCmsContent("badgeContent", {
    enabled: !!show,
  });

  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex flex-col gap-4 p-4 w-full bg-white rounded-20">
        <ContentImage
          alt=""
          width={36}
          height={36}
          className="w-9 h-9 aspect-square"
          src="/assets/icons/property/request_badge.svg"
        />
        <p className="text-sm text-brand-600 font-bold">
          {_STRINGS.REQUEST_FOR_BADGE}
        </p>
        {isLoading ? (
          <SkeletonText lines={2} />
        ) : (
          <CmsText className="text-xs">
            {badgeContent?.small_text || ""}
          </CmsText>
        )}

        {badge?.status ? (
          <StatusShower
            data={badge?.status}
            containerClass="w-full flex items-center justify-center !text-center"
          />
        ) : (
          <Button
            width="w-full"
            onClick={onRequest}
            loading={isPending}
            disabled={isPending}
            containerClass="w-full"
            roundedClass="rounded-full"
            title={_STRINGS.SUBMIT_REQUEST}
          />
        )}
      </div>
    </Modal>
  );
};

export default OwnerBadgeRequestModal;
