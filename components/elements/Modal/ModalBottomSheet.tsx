"use client";

import type { ModalBottomSheetProps } from "@/types/components/elements/modal";
import { Dialog, DialogPanel } from "@headlessui/react";
import { createPortal } from "react-dom";
import type { JSX } from "react";

import _STRINGS from "@/utils/LocalStrings";

const ModalBottomSheet = ({
  children,
  show = false,
  onHide,
  options,
}: ModalBottomSheetProps): JSX.Element | null => {
  if (!show || typeof document === "undefined") return null;

  return createPortal(
    <Dialog
      className="fixed inset-0"
      onClose={onHide}
      open
      style={{ zIndex: options?.zIndex ?? 1000 }}
    >
      <button
        aria-label={_STRINGS.CLOSE}
        className="fixed inset-0 cursor-default bg-black/70 backdrop-blur-xs"
        onClick={onHide}
        type="button"
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
