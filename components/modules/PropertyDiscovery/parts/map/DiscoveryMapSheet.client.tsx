"use client";

import { useEffect, useRef, useState } from "react";
import { useOverlayBackButton } from "@hooks/useOverlayBackButton";
import { useBodyScrollLock } from "@hooks/useBodyScrollLock";
import { createPortal } from "react-dom";

import type { DiscoveryMapSheetProps } from "@/types/components/modules/discovery-map";
import type { KeyboardEvent } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const DiscoveryMapSheet = ({
  label,
  onClose,
  children,
  isFilterOpen,
  onCloseFilters,
}: DiscoveryMapSheetProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const filterOpenRef = useRef(isFilterOpen);
  const [openedAt] = useState(() => window.location.href);
  const [opener] = useState(() => document.activeElement as HTMLElement | null);

  useEffect(() => {
    filterOpenRef.current = isFilterOpen;
  }, [isFilterOpen]);

  useBodyScrollLock(true);
  const requestClose = useOverlayBackButton(true, () => {
    if (!filterOpenRef.current) return onClose();
    onCloseFilters();
    return false;
  });

  const close = () =>
    window.location.href === openedAt ? requestClose() : onClose();

  useEffect(() => {
    rootRef.current?.focus();
    return () => opener?.focus();
  }, [opener]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const nodes = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
    ).filter((node) => node.offsetParent !== null);
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === rootRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[900] bg-surface outline-none"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {children(close)}
    </div>,
    document.body,
  );
};

export default DiscoveryMapSheet;
