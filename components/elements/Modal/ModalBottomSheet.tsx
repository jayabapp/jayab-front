"use client";

import type { ModalBottomSheetProps } from "@/types/components/elements/modal";

import { useRef, useState, type JSX, type TouchEvent } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { createPortal } from "react-dom";

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
      setDragOffset(0);
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
      style={{
        zIndex: options?.zIndex ?? 1000,
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="
          fixed inset-0
          cursor-default
          bg-overlay/70
          backdrop-blur-xs
        "
      />

      {/* Modal position wrapper */}
      <div
        className={`
          flex
          h-screen
          w-screen
          flex-col
          justify-end
          items-center
          fixed inset-0
          md:justify-center
          pointer-events-none
          supports-[height:100dvh]:h-[100dvh]
          supports-[width:100svw]:w-[100svw]
          ${options?.parentClass ?? ""}
        `}
      >
        <DialogPanel
          style={{
            transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,

            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          className={`
            pb-6
            w-full
            border
            md:pb-4
            relative
            bg-surface
            md:w-[35vw]
            border-line
            max-h-[90vh]
            rounded-t-20
            md:rounded-20
            overflow-y-auto
            shadow-elevated
            md:max-h-[75vh]
            overscroll-contain
            pointer-events-auto
            motion-reduce:transition-none
            supports-[height:100dvh]:max-h-[90dvh]
            supports-[height:100dvh]:md:max-h-[75dvh]
            ${options?.containerClass ?? ""}
          `}
        >
          {/* Mobile drag handle */}
          <div
            aria-hidden="true"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="
              sticky
              top-0
              z-10
              flex
              w-full
              cursor-grab
              touch-none
              justify-center
              bg-surface
              pb-1
              pt-2.5
              md:hidden
            "
          >
            <span className="h-1.5 w-10 rounded-full bg-surface-hover" />
          </div>

          {children}
        </DialogPanel>
      </div>
    </Dialog>,
    document.body,
  );
};

export default ModalBottomSheet;
