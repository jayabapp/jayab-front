"use client";

import type { AnimationlessModalProps } from "@/types/components/elements/modal";
import { Dialog, DialogPanel } from "@headlessui/react";
import { createPortal } from "react-dom";
import type { JSX } from "react";

const AnimationlessModal = ({
  children,
  show,
  onHide,
  options,
}: AnimationlessModalProps): JSX.Element => {
  if (!show || typeof document === "undefined") return <></>;

  const handleHide = onHide ?? (() => undefined);

  return createPortal(
    <Dialog
      open
      onClose={handleHide}
      className="fixed inset-0"
      style={{ zIndex: options?.zIndex ?? 1000 }}
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
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>,
    document.body,
  );
};

export default AnimationlessModal;
