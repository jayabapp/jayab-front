"use client";

import { propertyDetailOptions } from "@features/properties/api/property.options";
import { useStoreParams } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

import Link from "next/link";

type TPropertyCardProps = {
  href: string;
  title?: string;
  className?: string;
  children: ReactNode;
};

const PropertyCardLink = ({
  href,
  title,
  children,
  className,
}: TPropertyCardProps) => {
  const queryClient = useQueryClient();
  const slug = href.startsWith("/rooms/")
    ? decodeURIComponent(href.slice(7))
    : "";

  return (
    <Link
      prefetch={false}
      title={title}
      href={href}
      onMouseEnter={() => {
        if (slug) void queryClient.prefetchQuery(propertyDetailOptions(slug));
      }}
      onFocus={() => {
        if (slug) void queryClient.prefetchQuery(propertyDetailOptions(slug));
      }}
      onClick={() => useStoreParams.setState({ getBackHome: false })}
      className={className}
    >
      {children}
    </Link>
  );
};

export default PropertyCardLink;
