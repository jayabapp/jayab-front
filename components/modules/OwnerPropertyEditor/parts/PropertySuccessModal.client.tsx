"use client";

import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { useRouter } from "next/navigation";

import type { PropertySuccessModalProps } from "@/types/components/modules/owner-property";

import Button from "@elements/Button";
import Modal from "@elements/Modal";

const PropertySuccessModal = ({
  show,
  onConfirm,
}: PropertySuccessModalProps) => {
  const t = useTranslations();

  const router = useRouter();

  return (
    <Modal dismissible={false} show={show} onHide={() => undefined}>
      <div className="bg-white p-4 rounded-20 gap-4 flex flex-col items-center justify-center">
        <ContentImage
          alt=""
          width={256}
          height={256}
          className="w-64 aspect-square h-64"
          src="/assets/icons/adds/success_prop_add.svg"
        />
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <p className="text-brand-600 font-bold">
            {t("owner.urPropRegistered")}
          </p>
          <p className="text-sm text-center">
            {t("owner.urPropRegisteredDesc")}
          </p>
        </div>
        <div className="w-full flex items-center justify-center gap-4">
          <Button
            width="w-full"
            onClick={onConfirm}
            containerClass="w-full"
            title={t("common.pay")}
          />
          <Button
            width="w-full"
            variant="outline"
            containerClass="w-full"
            title={t("common.home")}
            onClick={() => router.push("/")}
          />
        </div>
      </div>
    </Modal>
  );
};

export default PropertySuccessModal;
