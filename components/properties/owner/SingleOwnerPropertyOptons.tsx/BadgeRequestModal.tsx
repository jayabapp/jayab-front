import { GetPropBadgeDto, SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import StatusShower from "@/components/shared/StatusShower";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation } from "@tanstack/react-query";
import React from "react";

const BadgeRequestModal = ({
  show,
  onHide,
  data,
  badgeData,
}: {
  data: SingleOwnerPropertyDto;
  show: boolean;
  onHide: () => void | null;
  badgeData: GetPropBadgeDto | null | undefined;
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.RequestSingleOwnerPropertyBadge,
    onSuccess: () => {
      onHide();
    },
  });

  const onRequest = () => {
    if (data?.id) mutate({ property_id: data?.id });
  };

  return (
    <Modal onHide={onHide} show={show}>
      <div className=" flex flex-col gap-4 p-4 w-full bg-white rounded-20">
        <img className="w-9 h-9 aspect-square" src="/assets/icons/property/request_badge.svg" />
        <p className="text-sm text-primary-700 font-bold">{_STRINGS.REQUEST_FOR_BADGE}</p>
        <p className="text-xs">{_STRINGS.LOREM}</p>

        {!!badgeData?.status ? (
          <StatusShower
            containerClass="w-full flex items-center justify-center !text-center"
            data={badgeData?.status}
          />
        ) : (
          <Button
            onClick={onRequest}
            loading={isPending}
            title={_STRINGS.SUBMIT_REQUEST}
            containerClass="w-full"
            width="w-full"
            roundedClass="rounded-full"
          />
        )}
      </div>
    </Modal>
  );
};

export default BadgeRequestModal;
