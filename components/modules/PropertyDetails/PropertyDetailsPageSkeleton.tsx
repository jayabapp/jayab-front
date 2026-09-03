import { PropertyGallerySkeleton } from "@modules/PropertyGallery";

import Skeleton from "@elements/Skeleton/Skeleton";

// The route's own fallback. PropertyDetailsSkeleton stays as it is because the
// detail modal and the two owner panels render it inside their own layouts;
// this one mirrors the page's three grid items so the swap to real content does
// not move anything.
const PANEL_CLASS = "surface-panel p-4 md:p-5";
const SPEC_ROWS = 6;

const PropertyDetailsPageSkeleton = () => (
  <div
    aria-busy="true"
    className="route-enter container grid !h-auto grid-cols-1 justify-start gap-4 !overflow-x-visible !pb-48 md:grid-cols-3 lg:!pb-36"
  >
    <div className="col-span-full hidden w-full md:flex">
      <Skeleton className="h-4 w-72 rounded" />
    </div>

    <div className="col-span-full w-full md:col-span-2">
      <PropertyGallerySkeleton />
    </div>

    <div className="col-span-full w-full md:col-span-1 md:row-span-2">
      <div className={`flex flex-col gap-3 ${PANEL_CLASS}`}>
        <Skeleton className="h-6 w-4/5 rounded" />
        <Skeleton className="h-3.5 w-2/5 rounded" />
        <div className="flex items-center gap-4 border-y border-neutral-100 py-2.5">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-7 w-44 rounded" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-14 flex-1 rounded-10" />
          ))}
        </div>
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>

    <div className="col-span-full flex w-full flex-col gap-4 md:col-span-2">
      <div className={`flex flex-col gap-2.5 ${PANEL_CLASS}`}>
        <Skeleton className="h-5 w-36 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-11/12 rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>

      <div className={PANEL_CLASS}>
        <Skeleton className="h-64 w-full rounded-10" />
      </div>

      <div className="surface-panel flex w-full flex-col overflow-hidden">
        {Array.from({ length: SPEC_ROWS }, (_, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-neutral-100 px-4 py-4 last:border-b-0"
          >
            <Skeleton className="h-4 w-44 rounded" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PropertyDetailsPageSkeleton;
