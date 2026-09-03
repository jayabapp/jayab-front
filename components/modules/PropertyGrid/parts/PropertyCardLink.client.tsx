"use client";

import { usePropertyDetailPrefetch } from "@features/properties/hooks/usePropertyDetailPrefetch";
import type { PropertyCardLinkProps } from "@/types/components/modules/property-grid";
import { useStoreParams } from "@/store";

import LinkPending from "@elements/LinkPending";
import Link from "next/link";

const ROOM_PATH_PREFIX = "/rooms/";

const PropertyCardLink = ({
  href,
  title,
  children,
  className,
}: PropertyCardLinkProps) => {
  const prefetchDetail = usePropertyDetailPrefetch();
  const slug = href.startsWith(ROOM_PATH_PREFIX)
    ? decodeURIComponent(href.slice(ROOM_PATH_PREFIX.length))
    : "";

  return (
    <Link
      href={href}
      title={title}
      onFocus={() => prefetchDetail(slug)}
      className={`relative ${className ?? ""}`}
      onMouseEnter={() => prefetchDetail(slug)}
      onClick={() => useStoreParams.setState({ getBackHome: false })}
    >
      {children}
      <LinkPending />
    </Link>
  );
};

export default PropertyCardLink;
