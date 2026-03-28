import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, JSX, ReactNode } from "react";
type ModalProps = {
  children?: ReactNode;
  onHide: () => void;
  show?: boolean;
  options?: op;
};
interface op {
  containerClass?: string;
  parentClass?: string;
}
const ModalBottomSheet = ({ children, show, onHide, options }: ModalProps): JSX.Element => {
  return (
    <Transition show={show}>
      <div className="fixed inset-0">
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
            <div className="fixed inset-0 bg-black bg-opacity-70 	backdrop-blur-sm	" />
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
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-200"
              leaveFrom=" translate-y-0"
              leaveTo=" translate-y-full"
            >
              <DialogPanel
                className={
                  options?.containerClass
                    ? options?.containerClass
                    : `mx-auto rounded-t-20 absolute pb-[1.5rem] max-h-[90dvh] lg:pb-10 bottom-0 lg:translate-x-1/2 lg:right-1/2 w-full lg:w-[calc(50svw)]  bg-white dark:bg-zinc-900 overflow-y-scroll  dark:bg-dark-700`
                }
              >
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </div>
    </Transition>
  );
};

export default ModalBottomSheet;
