"use client";

import type { BlogCardLinkProps } from "@/types/components/modules/blog";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

import LinkPending from "@elements/LinkPending";
import Link from "next/link";

/**
 * The card's link, with a full route prefetch on deliberate hover or focus.
 *
 * Viewport prefetching (Next's default) only warms a dynamic route as far as
 * the nearest loading boundary, so a click still waits on the article itself.
 * `router.prefetch` fetches the rest. Next's own `unstable_dynamicOnHover` prop
 * does exactly this, but it is missing from the Link types TypeScript resolves
 * and is marked unstable, so the same thing is done here through stable API.
 *
 * Mirrors the shape of PropertyCardLink, which warms property detail data the
 * same way.
 */
const BlogCardLink = ({
  href,
  title,
  children,
  className,
}: BlogCardLinkProps) => {
  const router = useRouter();
  const prefetched = useRef(false);

  // Once per mount: hovering along a row of cards must not re-issue a request
  // per pointer event.
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
      <LinkPending />
    </Link>
  );
};

export default BlogCardLink;
