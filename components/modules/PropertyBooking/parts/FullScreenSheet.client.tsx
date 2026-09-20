"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { createPortal } from "react-dom";
import { Icon } from "@elements/Icon";

import type { FullScreenSheetProps } from "@/types/components/modules/property-booking";

import _STRINGS from "@/utils/LocalStrings";

const SHEET_Z_INDEX = 1100;

const FullScreenSheet = ({
  show,
  title,
  onHide,
  footer,
  children,
}: FullScreenSheetProps) => {
  if (!show || typeof document === "undefined") return null;

  return createPortal(
    <Dialog
      open
      onClose={onHide}
      className="sheet-backdrop-enter fixed inset-0 bg-neutral-900/30"
      style={{ zIndex: SHEET_Z_INDEX }}
    >
      <DialogPanel className="sheet-panel-enter fixed inset-0 flex h-[100dvh] w-full flex-col bg-white">
        <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
          <button
            type="button"
            onClick={onHide}
            aria-label={_STRINGS.CLOSE}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Icon name="x" size={20} />
          </button>
          <h2 className="text-base font-bold text-neutral-900">{title}</h2>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {children}
        </div>

        {footer ? (
          <div className="border-t border-neutral-200 bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            {footer}
          </div>
        ) : null}
      </DialogPanel>
    </Dialog>,
    document.body,
  );
};

export default FullScreenSheet;
