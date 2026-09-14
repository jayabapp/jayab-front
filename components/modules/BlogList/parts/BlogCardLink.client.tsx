"use client";

import type { BlogCardLinkProps } from "@/types/components/modules/blog";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

import Link from "next/link";

const BlogCardLink = ({
  href,
  title,
  children,
  className,
}: BlogCardLinkProps) => {
  const router = useRouter();
  const prefetched = useRef(false);
  const warm = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;
    router.prefetch(href);
  }, [href, router]);

  return (
    <Link
      href={href}
      title={title}
      onFocus={warm}
      onMouseEnter={warm}
      className={`relative ${className ?? ""}`}
    >
      {children}
    </Link>
  );
};

export default BlogCardLink;
