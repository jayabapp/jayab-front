import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import type { ModalBottomSheetProps } from "@/types/components/elements/modal";
import type { JSX } from "react";
import { Fragment } from "react";

const ModalBottomSheet = ({ children, show, onHide, options }: ModalBottomSheetProps): JSX.Element => {
  return (
    <Transition show={show} as="div" className="fixed inset-0">
      <Dialog as="div" className="relative" style={{ zIndex: 1000 }} onClose={onHide}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 	backdrop-blur-xs	" />
        </TransitionChild>

        <div
          className={
            options?.parentClass
              ? options?.parentClass
              : "fixed inset-y-0 w-[100svw] h-[100dvh] flex flex-col justify-center "
          }
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom=" translate-y-full  md:translate-y-0  md:opacity-0 md:scale-95"
            enterTo=" translate-y-0 md:translate-y-auto   md:opacity-100 md:scale-100"
            leave="ease-in duration-200"
            leaveFrom=" translate-y-0  md:translate-y-auto md:opacity-100 md:scale-100"
            leaveTo=" translate-y-full md:translate-y-auto md:opacity-0 md:scale-95"
          >
            <DialogPanel
              className={`mx-auto rounded-t-20 md:rounded-20 max-h-[90dvh] md:max-h-[75dvh] absolute pb-[1.5rem] md:pb-4 bottom-0 md:bottom-auto md:translate-x-1/2 md:right-1/2 w-full md:w-[calc(35svw)]  overflow-y-scroll bg-white  ${options?.containerClass}`}
            >
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalBottomSheet;
