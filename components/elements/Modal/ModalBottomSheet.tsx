"use client";

import type { ModalBottomSheetProps } from "@/types/components/elements/modal";
import { Dialog, DialogPanel } from "@headlessui/react";
import { createPortal } from "react-dom";
import { useRef, useState, type JSX, type TouchEvent } from "react";

// Swipe-down-to-close threshold, in px, before releasing the drag closes the
// sheet instead of snapping back (FEATURE.md §12.3).
const DISMISS_THRESHOLD_PX = 90;

const ModalBottomSheet = ({
  onHide,
  options,
  children,
  show = false,
}: ModalBottomSheetProps): JSX.Element | null => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef<number | null>(null);

  if (!show || typeof document === "undefined") return null;

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    dragStartY.current = event.touches[0]?.clientY ?? null;
    setIsDragging(true);
  };

  const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    const delta = (event.touches[0]?.clientY ?? 0) - dragStartY.current;
    if (delta > 0) setDragOffset(delta);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    dragStartY.current = null;
    if (dragOffset > DISMISS_THRESHOLD_PX) {
      onHide();
      return;
    }
    setDragOffset(0);
  };

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
        className={`pointer-events-none fixed inset-0 flex h-screen w-screen flex-col justify-end supports-[height:100dvh]:h-[100dvh] supports-[width:100svw]:w-[100svw] md:grid md:place-items-center ${options?.parentClass ?? ""}`}
      >
        <DialogPanel
          style={{
            transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          className={`pointer-events-auto relative mx-auto max-h-[90vh] w-full overflow-y-auto overscroll-contain rounded-t-20 bg-white pb-6 shadow-2xl motion-reduce:transition-none supports-[height:100dvh]:max-h-[90dvh] md:mx-0 md:max-h-[75vh] md:w-[35vw] md:rounded-20 md:pb-4 supports-[height:100dvh]:md:max-h-[75dvh] ${options?.containerClass ?? ""}`}
        >
          {/* Decorative drag affordance only — the accessible close control is
          the header's close button (`ModalHeaderPart` with `showX`). */}
          <div
            aria-hidden="true"
            onTouchEnd={onTouchEnd}
            onTouchMove={onTouchMove}
            onTouchStart={onTouchStart}
            className="sticky top-0 z-10 flex w-full cursor-grab touch-none justify-center bg-white pb-1 pt-2.5 md:hidden"
          >
            <span className="h-1.5 w-10 rounded-full bg-neutral-200" />
          </div>

          {children}
        </DialogPanel>
      </div>
    </Dialog>,
    document.body,
  );
};

export default ModalBottomSheet;
