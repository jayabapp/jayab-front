import Skeleton from "@elements/Skeleton/Skeleton";

// Mirrors BlogDetails.tsx one-for-one: same container paddings, the same
// two-column header, the same 2/3 + 1/3 body grid. A fallback whose boxes sit
// where the real content lands is what makes the swap read as the page filling
// in rather than as a second, unrelated layout flashing past.
const PANEL_CLASS =
  "rounded-20 border border-white bg-white p-4 shadow-glass-sm md:p-6";

const BODY_LINES = 12;
const SIDEBAR_ROWS = 6;

const BlogDetailsSkeleton = () => (
  <div
    aria-busy="true"
    className="route-enter app-container relative !pt-24 flex flex-col !gap-6 !overflow-visible"
  >
    <Skeleton className="hidden h-4 w-64 rounded md:block" />

    <header className="grid w-full grid-cols-1 items-center gap-5 md:grid-cols-[minmax(0,1fr)_26rem] md:gap-8">
      <div className="flex w-full flex-col gap-3.5">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-8 w-11/12 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-neutral-100 py-3">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-3.5 w-28 rounded" />
        </div>
      </div>

      <Skeleton className="aspect-[4/3] w-full rounded-20" />
    </header>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className={`col-span-1 w-full md:col-span-2 ${PANEL_CLASS}`}>
        <div className="mx-auto flex max-w-[68ch] flex-col gap-3">
          {Array.from({ length: BODY_LINES }, (_, index) => (
            <Skeleton
              key={index}
              // Every fourth line is short so the block reads as paragraphs
              // breaking rather than as one uniform slab of grey.
              className={`h-4 rounded ${index % 4 === 3 ? "w-2/3" : "w-full"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex h-fit flex-col gap-6 self-start">
        <div className={`flex flex-col gap-3 ${PANEL_CLASS}`}>
          <Skeleton className="h-5 w-40 rounded" />
          {Array.from({ length: SIDEBAR_ROWS }, (_, index) => (
            <Skeleton key={index} className="h-3.5 w-full rounded" />
          ))}
        </div>

        <div className={`flex flex-col gap-3 ${PANEL_CLASS}`}>
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
      </div>
    </div>
  </div>
);

export default BlogDetailsSkeleton;
