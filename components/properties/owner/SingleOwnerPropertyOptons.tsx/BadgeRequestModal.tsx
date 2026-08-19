import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { GetPropBadgeDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import { useMutation } from "@tanstack/react-query";

import useCmsContent from "@/hooks/useCmsContent";
import SmallLoading from "@/components/shared/Lotties/SmallLoading";
import StatusShower from "@/components/shared/StatusShower";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@/components/shared/CmsText";
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/Modal";
import React from "react";

const BadgeRequestModal = ({
  show,
  onHide,
  data,
  badgeData,
  setRefresh,
}: {
  data: SingleOwnerPropertyDto;
  show: boolean;
  onHide: () => void | null;
  badgeData: GetPropBadgeDto | null | undefined;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.RequestSingleOwnerPropertyBadge,
    onSuccess: () => {
      if (!!setRefresh) setRefresh((e) => !e);
      onHide();
    },
  });

  const onRequest = () => {
    if (data?.id) mutate({ property_id: data?.id });
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
          <SmallLoading />
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
