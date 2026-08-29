"use client";

import { ReactNode, useState } from "react";

import { MultiLineFormInput } from "@elements/Form";
import { BtnLoading } from "@elements/Button";
import _STRINGS from "@/utils/LocalStrings";
import Modal from "@elements/Modal";

type ModalProps = {
  options?: op;
  text: string;
  title?: string;
  hideText?: string;
  onHide: () => void;
  isVisible?: boolean;
  isLoading?: boolean;
  confirmText?: string;
  children?: ReactNode;
  headerImage?: string;
  messageClass?: string;
  hideTextClassName?: string;
  confirmTextClassName?: string;
  onConfirm: (e?: string | null | undefined) => void | null;
};
interface op {
  hasInput?: boolean;
  inputTitle?: string;
  containerClass?: string;
}
const ConfirmModal = ({
  isVisible,
  onHide,
  isLoading,
  text,
  confirmText = "بله، مطمئنم",
  hideText = "خیر",
  onConfirm,
  title,
  headerImage,
  confirmTextClassName,
  messageClass,
  hideTextClassName,
  options,
}: ModalProps) => {
  const [message, setMessage] = useState("");
  return (
    <Modal
      show={isVisible}
      onHide={onHide}
      options={{
        containerClass:
          "mx-auto my-20   w-11/12 md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-lg overflow-y-scroll  bg-white  ",
      }}
    >
      <div
        className={
          "w-full flex items-center justify-center flex-col rounded-lg p-4"
        }
      >
        {headerImage ? (
          <img
            className="w-[3.25rem] aspect-square  object-contain "
            src={headerImage}
          />
        ) : (
          <></>
        )}
        {title ? (
          <p className="font-medium text-center text-base text-brand-600  my-5">
            {title}
          </p>
        ) : (
          ""
        )}
        <p
          className={`font-light text-center text-sm  my-5  ${messageClass}`}
        >
          {text}
        </p>
        {options?.hasInput ? (
          <MultiLineFormInput
            item={{
              title: options?.inputTitle || _STRINGS.MESSAGE,
              inputClass: "  !w-full !bg-neutral-50",
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
            className={`bg-brand-600  w-full hover:opacity-80 transition-all duration-200 ease-in-out text-white mx-2 text-center py-2.5 rounded-md cursor-pointer flex justify-center items-center ${confirmTextClassName} `}
            onClick={() => {
              if (!isLoading) {
                onConfirm();
              }
            }}
          >
            {isLoading ? <BtnLoading /> : confirmText}
          </div>
          <div
            className={`  bg-neutral-300 hover:opacity-80 transition-all duration-200 ease-in-out w-full mx-2 text-center py-2.5 rounded-md cursor-pointer ${hideTextClassName}`}
            onClick={() => {
              if (!isLoading) onHide();
            }}
          >
            {hideText}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
