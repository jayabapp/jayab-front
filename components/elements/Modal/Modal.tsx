"use client";

import type { ModalProps } from "@/types/components/elements/modal";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { JSX } from "react";

const Modal = ({
  show,
  onHide,
  zIndex,
  options,
  onScroll,
  children,
  dismissible = true,
}: ModalProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const handleHide = () => {
    if (dismissible) onHide();
  };

  useEffect(() => {
    if (!show) return;
    const scrollTimer = window.setTimeout(() => {
      ref.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 10);
    return () => window.clearTimeout(scrollTimer);
  }, [show]);

  if (!show || typeof document === "undefined") return <></>;

  return createPortal(
    <Dialog
      open
      onClose={handleHide}
      className="fixed inset-0"
      style={{ zIndex: zIndex ?? options?.zIndex ?? 1000 }}
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 cursor-default bg-black/70"
      />

      <div
        className={`${options?.parentClass ?? ""} pointer-events-none fixed inset-0 flex h-screen w-screen flex-col justify-center supports-[height:100dvh]:h-[100dvh] supports-[width:100svw]:w-[100svw]`}
      >
        <DialogPanel
          className={`pointer-events-auto ${
            options?.containerClass ??
            "mx-auto my-20 max-h-[calc(100vh-10rem)] w-11/12 overflow-y-auto overscroll-contain rounded-2xl bg-white supports-[height:100dvh]:max-h-[calc(100dvh-10rem)] md:w-1/2 xl:w-1/3 2xl:w-1/4"
          }`}
          ref={ref}
          onScroll={(event) => onScroll?.(event.currentTarget.scrollTop)}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>,
    document.body,
  );
};

export default Modal;
