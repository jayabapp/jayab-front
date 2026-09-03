"use client";

import type { ModalBottomSheetProps } from "@/types/components/elements/modal";
import { Dialog, DialogPanel } from "@headlessui/react";
import { createPortal } from "react-dom";
import type { JSX } from "react";

const ModalBottomSheet = ({
  onHide,
  options,
  children,
  show = false,
}: ModalBottomSheetProps): JSX.Element | null => {
  if (!show || typeof document === "undefined") return null;

  return createPortal(
    <Dialog
      open
      onClose={onHide}
      className="fixed inset-0"
      style={{ zIndex: options?.zIndex ?? 1000 }}
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 cursor-default bg-black/70 backdrop-blur-xs"
      />

      <div
        className={`pointer-events-none fixed inset-0 flex h-screen w-screen flex-col justify-end supports-[height:100dvh]:h-[100dvh] supports-[width:100svw]:w-[100svw] md:justify-center ${options?.parentClass ?? ""}`}
      >
        <DialogPanel
          className={`pointer-events-auto relative mx-auto max-h-[90vh] w-full overflow-y-auto overscroll-contain rounded-t-20 bg-white pb-6 shadow-2xl supports-[height:100dvh]:max-h-[90dvh] md:max-h-[75vh] md:w-[35vw] md:rounded-20 md:pb-4 supports-[height:100dvh]:md:max-h-[75dvh] ${options?.containerClass ?? ""}`}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>,
    document.body,
  );
};

export default ModalBottomSheet;
