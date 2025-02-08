import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import React from "react";
import Modal from ".";
import SmallLoading from "../shared/Lotties/SmallLoading";
type ModalProps = {
  children?: ReactNode;
  onHide: () => void;
  onConfirm: () => void | null;
  isVisible?: boolean;
  isLoading?: boolean;
  options?: op;
  text: string;
  confirmText?: string;
  confirmTextClassName?: string;
  hideText?: string;
  hideTextClassName?: string;
  title?: string;
  headerImage?: string;
};
interface op {
  containerClass: string;
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
  hideTextClassName,
}: ModalProps) => {
  const router = useRouter();
  return (
    <Modal
      show={isVisible}
      onHide={onHide}
      options={{
        containerClass:
          "mx-auto my-20   w-11/12 md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-lg overflow-y-scroll  bg-white  dark:bg-zinc-800",
      }}
    >
      <div className={"w-full flex items-center justify-center flex-col rounded-lg p-4"}>
        {headerImage ? <img className="w-[3.25rem] aspect-square  object-contain " src={headerImage} /> : <></>}

        {/* <Lottie width={100} height={100} options={{ animationData: LottieAnimation, loop: false }} /> */}
        {title ? (
          <p className="font-medium text-center text-base text-primary-700 dark:text-zinc-300 my-5">{title}</p>
        ) : (
          ""
        )}
        <p className="font-light text-center text-sm dark:text-neutral-200 my-5">{text}</p>
        <div className="flex flex-row w-full px-4  gap-4 justify-evenly mx-auto mb-4">
          <div
            className={`bg-primary-700 dark:bg-primary-600 w-full hover:opacity-80 transition-all duration-200 ease-in-out text-white mx-2 text-center py-2.5 rounded-md cursor-pointer flex justify-center items-center ${confirmTextClassName} `}
            onClick={() => {
              if (!isLoading) {
                onConfirm();
              }
            }}
          >
            {isLoading ? <SmallLoading /> : confirmText}
          </div>
          <div
            className={`  bg-gray-300 hover:opacity-80 transition-all duration-200 ease-in-out w-full mx-2 text-center py-2.5 rounded-md cursor-pointer ${hideTextClassName}`}
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
