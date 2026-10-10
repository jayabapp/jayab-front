"use client";

import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { BtnLoading } from "@elements/Button";
import { useState } from "react";

import type { ConfirmModalProps } from "@/types/components/elements/modal-variants";

import MultiLineFormInput from "@elements/Form/MultiLineFormInput";
import Modal from "./Modal";

const ConfirmModal = ({
  text,
  title,
  onHide,
  options,
  isLoading,
  onConfirm,
  isVisible,
  headerImage,
  messageClass,
  hideTextClassName,
  confirmTextClassName,
  hideText: hideTextProp,
  confirmText: confirmTextProp,
}: ConfirmModalProps) => {
  const t = useTranslations("common");
  const confirmText = confirmTextProp ?? t("yesSure");
  const hideText = hideTextProp ?? t("no");

  const [message, setMessage] = useState("");
  return (
    <Modal
      show={isVisible}
      onHide={onHide}
      options={{
        containerClass:
          "mx-auto my-20   w-11/12 md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-lg overflow-y-scroll  bg-surface  ",
      }}
    >
      <div
        className={"w-full flex items-center justify-center flex-col rounded-lg p-4"}>
        {headerImage ? (
          <ContentImage
            alt=""
            width={52}
            height={52}
            src={headerImage}
            className="w-[3.25rem] aspect-square  object-contain "
          />
        ) : (
          <></>
        )}
        {title ? (
          <p className="font-medium text-center text-base text-link  my-5">
            {title}
          </p>
        ) : (
          ""
        )}
        <p className={`font-light text-center text-sm  my-5  ${messageClass}`}>
          {text}
        </p>
        {options?.hasInput ? (
          <MultiLineFormInput
            item={{
              title: options?.inputTitle || t("message"),
              inputClass: "  !w-full !bg-surface-muted",
              containerClass: "pb-4 w-full",
              rows: 4,
            }}
            value={message}
            onChangeText={(e) => {
              setMessage(e);
            }}
          />
        ) : (
          <></>
        )}
        <div className="flex flex-row w-full px-4  gap-4 justify-evenly mx-auto mb-4">
          <div
            onClick={() => {if (!isLoading) onConfirm()}
            className={`bg-action w-full hover:opacity-80 transition-all duration-200 ease-in-out text-on-action mx-2 text-center py-2.5 rounded-md cursor-pointer flex justify-center items-center ${confirmTextClassName} `}
          >
            {isLoading ? <BtnLoading /> : confirmText}
          </div>
          <div
            onClick={() =>  if (!isLoading) onHide()}
            className={`bg-line-strong hover:opacity-80 transition-all duration-200 ease-in-out w-full mx-2 text-center py-2.5 rounded-md cursor-pointer ${hideTextClassName}`}
          >
            {hideText}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
