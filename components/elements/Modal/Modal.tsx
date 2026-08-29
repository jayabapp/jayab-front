"use client";

import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import type { ModalProps } from "@/types/components/elements/modal";
import { Fragment, useEffect, useRef } from "react";
import type { JSX } from "react";

const Modal = ({ children, show, onHide, options, onScroll, zIndex }: ModalProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollTimer = window.setTimeout(() => {
      ref.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 10);
    return () => window.clearTimeout(scrollTimer);
  }, [show]);
  return (
    <Transition show={show}>
      <div className="fixed inset-0">
        <Dialog as="div" className="relative" style={{ zIndex: zIndex || 1000 }} onClose={onHide}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70 		" />
          </TransitionChild>

          <div
            className={` ${
              options?.parentClass || ""
            } fixed inset-y-0 w-[100dvw] h-[100dvh] flex flex-col justify-center `}
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={
                  options?.containerClass
                    ? options?.containerClass
                    : "mx-auto my-20 w-11/12 md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-2xl overflow-y-scroll bg-white "
                }
                ref={ref}
                onScroll={(e) => {
                  if (onScroll) {
                    onScroll(e.currentTarget.scrollTop);
                  }
                }}
              >
                {children}
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </Dialog>
      </div>
    </Transition>
  );
};

export default Modal;
