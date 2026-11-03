import type { RelatedBlogsSectionProps } from "@/types/components/modules/blog";
import { getServerRelatedBlogs } from "@features/blog/server/blog.server";

import Skeleton from "@elements/Skeleton/Skeleton";
import RelatedBlogs from "./RelatedBlogs";

export const RelatedBlogsFallback = () => (
  <div aria-busy="true" className="flex flex-col gap-3">
    <Skeleton className="h-5 w-28 rounded" />
    {Array.from({ length: 3 }, (_, index) => (
      <div className="flex items-center gap-3" key={index}>
        <Skeleton className="size-16 shrink-0 rounded-xl" />
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3 w-2/3 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const RelatedBlogsSection = async ({
  currentId,
}: RelatedBlogsSectionProps) => {
  const items = await getServerRelatedBlogs();

  return <RelatedBlogs currentId={currentId} items={items} />;
};

export default RelatedBlogsSection;
