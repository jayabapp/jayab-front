"use client";

import { useLinkStatus } from "next/link";

import BtnLoading from "@elements/Button/BtnLoading";

/**
 * Per-card acknowledgement that a click registered.
 *
 * `useLinkStatus` only reports for the <Link> above it, so this has to render
 * as a descendant of the link it belongs to — it cannot style that link from
 * the outside, hence the overlay. The host link needs `relative`.
 *
 * The global bar covers the whole page; this covers the specific card, which is
 * where the user is actually looking when they click.
 */
const LinkPending = () => {
  const { pending } = useLinkStatus();

  if (!pending) return <></>;

  return (
    <span className="absolute inset-0 z-2 flex items-center justify-center bg-white/55 text-brand-600">
      <BtnLoading />
    </span>
  );
};

export default LinkPending;
