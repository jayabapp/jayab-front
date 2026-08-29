"use client";

import type { AnimationlessModalProps } from "@/types/components/elements/modal";
import { Dialog, Transition } from "@headlessui/react";
import type { JSX } from "react";

const AnimationlessModal = ({ children, show, onHide, options }: AnimationlessModalProps): JSX.Element => {
  // useModalBack(show, onHide);
  return (
    <Transition show={show}>
      <div className="fixed inset-0">
        <Dialog
          as="div"
          className="relative"
          style={{ zIndex: options?.zIndex ? options?.zIndex : 1000 }}
          onClose={!!onHide ? onHide : () => {}}
        >
          <div className="fixed inset-0 bg-black bg-opacity-70 	" onClick={onHide} />

          <div
            className={` ${
              options?.parentClass ? options?.parentClass : ""
            } fixed inset-y-0 w-screen h-[100dvh] flex flex-col justify-center `}
          >
            <div
              className={
                options?.containerClass
                  ? options?.containerClass
                  : "mx-auto my-20   w-11/12 md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-2xl overflow-y-scroll  bg-white   "
              }
            >
              {children}
            </div>
          </div>
        </Dialog>
      </div>
    </Transition>
  );
};

export default AnimationlessModal;
