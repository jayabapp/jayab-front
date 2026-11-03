// Imported from the skeleton file rather than the module barrel on purpose: a
// route loading boundary is evaluated during prerender, and going through the
// index would drag the module's client islands and feature hooks into that
// graph for the sake of one static component.
import { BlogGridSkeleton } from "@modules/BlogList/parts/BlogGridSkeleton";

import Skeleton from "@elements/Skeleton/Skeleton";

// Route-level fallback. Without one, the App Router has nowhere to commit the
// transition to, so it holds the previous page on screen for the whole server
// render and the navigation reads as a freeze. It also gives `prefetch` a
// boundary to prefetch *to*: for a dynamic route Next only prefetches as far as
// the nearest loading boundary, so with none present prefetching buys nothing.
const BlogListLoading = () => (
  <div aria-busy="true" className="route-enter app-container !overflow-visible">
    <Skeleton className="h-4 w-56 rounded" />
    <div className="mt-6">
      <BlogGridSkeleton />
    </div>
  </div>
);

export default BlogListLoading;
