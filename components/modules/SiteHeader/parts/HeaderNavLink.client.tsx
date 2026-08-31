"use client";

import type { HeaderNavLinkProps } from "@/types/components/modules/site-header";
import { PulseDot } from "@elements/Badge";

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
      className={`${isLight ? "text-white" : "text-black"} text-sm xl:text-base transition-all duration-100 shrink-0 font-medium group-hover:brightness-100 group-hover:text-brand-600`}
    >
      {title}
    </p>
  );

  const badge = hasBadge ? (
    <PulseDot className="absolute -left-2 -top-0.5 z-1" />
  ) : null;

  if (route)
    return (
      <Link
        href={route}
        title={title}
        prefetch={false}
        className={CONTAINER_CLASS}
      >
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
