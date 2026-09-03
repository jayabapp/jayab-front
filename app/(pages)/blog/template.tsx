import type { ReactNode } from "react";

/**
 * A template, unlike a layout, is given a fresh instance on every navigation,
 * which is what lets the enter animation replay each time.
 *
 * Scoped to /blog on purpose. A root-level template would also remount on
 * searchParams-only navigations, which on /rooms and /[slug] means every filter
 * change would tear down and rebuild the results list. Blog routes carry no
 * such state, so here the remount costs nothing.
 */
const BlogTemplate = ({ children }: { children: ReactNode }) => (
  <div className="route-enter h-full w-full">{children}</div>
);

export default BlogTemplate;
