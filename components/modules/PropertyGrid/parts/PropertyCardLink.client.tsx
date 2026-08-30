"use client";

import { usePropertyDetailPrefetch } from "@features/properties/hooks/usePropertyDetailPrefetch";
import type { PropertyCardLinkProps } from "@/types/components/modules/property-grid";
import { useStoreParams } from "@/store";

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
      prefetch={false}
      className={className}
      onFocus={() => prefetchDetail(slug)}
      onMouseEnter={() => prefetchDetail(slug)}
      onClick={() => useStoreParams.setState({ getBackHome: false })}
    >
      {children}
    </Link>
  );
};

export default PropertyCardLink;
