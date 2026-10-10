"use client";

import { PulseDot } from "@elements/Badge";

import type { HeaderNavLinkProps } from "@/types/components/modules/site-header";

import Link from "next/link";

const CONTAINER_CLASS =
  "flex items-center relative transition-all group justify-center col-span-1 gap-2 flex-row";

const HeaderNavLink = ({
  title,
  route,
  isLight,
  hasBadge,
  onSelect,
}: HeaderNavLinkProps) => {
  const label = (
    <p
      className={`nav-underline relative ${
        isLight
          ? "text-white group-hover:text-brand-200"
          : "text-ink group-hover:text-link"
      } text-sm xl:text-base transition-colors duration-150 shrink-0 font-medium`}
    >
      {title}
    </p>
  );

  const badge = hasBadge ? (
    <PulseDot className="absolute -end-2 -top-0.5 z-1" />
  ) : null;

  if (route)
    return (
      <Link href={route} title={title} className={CONTAINER_CLASS}>
        {badge}
        {label}
      </Link>
    );

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${CONTAINER_CLASS} cursor-pointer`}
    >
      {badge}
      {label}
    </button>
  );
};

export default HeaderNavLink;
