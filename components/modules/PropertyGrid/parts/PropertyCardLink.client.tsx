"use client";

import type { PropertyCardLinkProps } from "@/types/components/modules/property-grid";
import { useStoreParams } from "@/store";

import LinkPending from "@elements/LinkPending";
import Link from "next/link";

const PropertyCardLink = ({
  href,
  title,
  children,
  className,
}: PropertyCardLinkProps) => {
  return (
    <Link
      href={href}
      title={title}
      className={`relative ${className ?? ""}`}
      onClick={() => useStoreParams.setState({ getBackHome: false })}
    >
      {children}
      <LinkPending />
    </Link>
  );
};

export default PropertyCardLink;
