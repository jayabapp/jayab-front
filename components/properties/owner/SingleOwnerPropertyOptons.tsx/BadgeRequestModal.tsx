import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { GetPropBadgeDto } from "@/api_services/property/property.interface";
import { usePropertyBadge } from "@features/owner-property/hooks/usePropertyBadge";

import useCmsContent from "@/hooks/useCmsContent";
import SkeletonText from "@/components/elements/Skeleton/SkeletonText";
import StatusShower from "@/components/shared/StatusShower";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@/components/shared/CmsText";
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/Modal";
import React from "react";

type TBadgeRequestModalProps = {
  show: boolean;
  onHide: () => void | null;
  data: SingleOwnerPropertyDto;
  badgeData: GetPropBadgeDto | null | undefined;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const BadgeRequestModal = ({
  show,
  data,
  onHide,
  badgeData,
  setRefresh,
}: TBadgeRequestModalProps) => {
  const {
    request: { mutate, isPending },
  } = usePropertyBadge(data?.id ?? "");
  const onRequest = () => {
    if (data?.id)
      mutate(
        { property_id: data.id },
        {
          onSuccess: () => {
            if (!!setRefresh) setRefresh((e) => !e);
            onHide();
          },
        },
      );
  };

  const { content: badgeContent, isLoading } = useCmsContent("badgeContent", {
    enabled: !!show,
  });

  return (
    <Modal onHide={onHide} show={show}>
      <div className=" flex flex-col gap-4 p-4 w-full bg-white rounded-20">
        <img
          className="w-9 h-9 aspect-square"
          src="/assets/icons/property/request_badge.svg"
        />
        <p className="text-sm text-primary-700 font-bold">
          {_STRINGS.REQUEST_FOR_BADGE}
        </p>
        {isLoading ? (
          <SkeletonText lines={2} />
        ) : (
          <CmsText className="text-xs">
            {badgeContent?.small_text || ""}
          </CmsText>
        )}

        {!!badgeData?.status ? (
          <StatusShower
            data={badgeData?.status}
            containerClass="w-full flex items-center justify-center !text-center"
          />
        ) : (
          <Button
            width="w-full"
            onClick={onRequest}
            loading={isPending}
            containerClass="w-full"
            roundedClass="rounded-full"
            title={_STRINGS.SUBMIT_REQUEST}
          />
        )}
      </div>
    </Modal>
  );
};

export default BadgeRequestModal;
