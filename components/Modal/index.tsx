"use client";

import React, { Fragment, JSX, ReactNode, useEffect, useRef } from "react";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { useRouter } from "next/router";
type ModalProps = {
  children?: ReactNode;
  onHide: () => void;
  onScroll?: React.Dispatch<React.SetStateAction<number>>;
  show?: boolean;
  type?: "bottom-sheet";
  options?: op;
};
interface op {
  containerClass?: string;
  parentClass?: string;
}
const Modal = ({ children, show, onHide, options, onScroll, type }: ModalProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 10);
  }, [show]);

  const _findAnimationClass = () => {
    switch (type) {
      case "bottom-sheet":
        return {
          enter: "ease-out duration-300",
          enterFrom: "translate-y-full",
          enterTo: "translate-y-0",
          leave: "ease-in duration-200",
          leaveFrom: " translate-y-0",
          leaveTo: " translate-y-full",
        };
      default:
        return {
          enter: "ease-out duration-300",
          enterFrom: "opacity-0 scale-95",
          enterTo: "opacity-100 scale-100",
          leave: "ease-in duration-200",
          leaveFrom: "opacity-100 scale-100",
          leaveTo: "opacity-0 scale-95",
        };
    }
  };
  return (
    <Transition show={show}>
      <div className="fixed inset-0">
        <Dialog as="div" className="relative" style={{ zIndex: 1000 }} onClose={onHide}>
          <TransitionChild as={Fragment} {..._findAnimationClass}>
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
                    : "mx-auto my-20 w-11/12 md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-2xl overflow-y-scroll bg-white dark:bg-zinc-900"
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
