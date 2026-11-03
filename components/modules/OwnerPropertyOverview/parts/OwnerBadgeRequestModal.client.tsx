"use client";

import { usePropertyBadge } from "@features/owner-property/hooks/usePropertyBadge";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { OwnerBadgeRequestModalProps } from "@/types/components/modules/owner-property";

import useCmsContent from "@/hooks/useCmsContent";
import StatusShower from "@elements/StatusShower";
import SkeletonText from "@elements/Skeleton/SkeletonText";
import CmsText from "@elements/CmsText";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

const OwnerBadgeRequestModal = ({
  show,
  badge,
  onHide,
  property,
}: OwnerBadgeRequestModalProps) => {
  const t = useTranslations("owner");

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
      <div className="flex flex-col gap-4 p-4 w-full bg-surface rounded-20">
        <ContentImage
          alt=""
          width={36}
          height={36}
          className="w-9 h-9 aspect-square"
          src="/assets/icons/property/request_badge.svg"
        />
        <p className="text-sm text-link font-bold">{t("requestForBadge")}</p>
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
            title={t("submitRequest")}
          />
        )}
      </div>
    </Modal>
  );
};

export default OwnerBadgeRequestModal;
