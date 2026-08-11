"use client";

import { useStoreParams } from "@/store";
import { ReactNode } from "react";

import Link from "next/link";

const PropertyCardLink = ({
  href,
  title,
  className,
  children,
}: {
  href: string;
  title?: string;
  className?: string;
  children: ReactNode;
}) => (
  <Link
    prefetch={false}
    title={title}
    href={href}
    onClick={() => useStoreParams.setState({ getBackHome: false })}
    className={className}
  >
    {children}
  </Link>
);

export default PropertyCardLink;
