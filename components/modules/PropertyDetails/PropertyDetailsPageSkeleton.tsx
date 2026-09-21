import { PropertyGallerySkeleton } from "@modules/PropertyGallery";

import { PageSurface } from "@elements/PageSurface";
import Skeleton from "@elements/Skeleton/Skeleton";

const ACTION_COUNT = 4;
const TAB_COUNT = 5;
const FACT_COUNT = 4;
const AMENITY_COUNT = 6;

const SECTION_CLASS =
  "flex flex-col gap-4 border-b border-neutral-100 py-6 md:py-8";

// Mirrors the listing layout: header, gallery, section tabs, sections beside a
// sticky booking card, and the mobile bottom bar.
const PropertyDetailsPageSkeleton = () => (
  <div
    aria-busy="true"
    className="container flex !h-auto flex-col !overflow-x-visible !pb-48 lg:!pb-36"
  >
    <PageSurface />

    <header className="flex flex-col gap-3 pb-4 pt-2 md:pb-6">
      <div className="hidden md:flex">
        <Skeleton className="h-4 w-72 rounded" />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="flex min-w-0 flex-col gap-3">
          <Skeleton className="h-7 w-4/5 rounded md:h-8 md:w-96" />
          <Skeleton className="h-4 w-40 rounded" />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {Array.from({ length: ACTION_COUNT }, (_, index) => (
            <Skeleton
              key={index}
              className={`h-9 rounded-full ${index === 0 ? "w-24" : "w-14"}`}
            />
          ))}
        </div>
      </div>
    </header>

    <PropertyGallerySkeleton />

    <div className="mb-2 mt-4 flex gap-2 overflow-hidden border-b border-neutral-100 py-2 md:mt-6">
      {Array.from({ length: TAB_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-8 w-20 shrink-0 rounded-full" />
      ))}
    </div>

    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-12">
      <div className="flex w-full flex-col md:col-span-7 lg:col-span-8">
        <section className={SECTION_CLASS}>
          <Skeleton className="h-5 w-28 rounded" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: FACT_COUNT }, (_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="size-6 shrink-0 rounded-md" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-2/3 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>

          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        </section>

        <section className={SECTION_CLASS}>
          <Skeleton className="h-5 w-32 rounded" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: AMENITY_COUNT }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-6 shrink-0 rounded-md" />
                <Skeleton className="h-4 w-3/5 rounded" />
              </div>
            ))}
          </div>

          <Skeleton className="h-11 w-44 rounded-10" />
        </section>

        <section className={SECTION_CLASS}>
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-64 w-full rounded-20" />
        </section>
      </div>

      <aside className="hidden w-full md:col-span-5 md:block lg:col-span-4">
        <div className="flex w-full flex-col gap-4 rounded-20 border border-neutral-200 bg-white p-5 shadow-glass-sm md:sticky md:top-36">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-7 w-44 rounded" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex divide-x divide-x-reverse divide-neutral-200 overflow-hidden rounded-10 border border-neutral-200">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="flex flex-1 flex-col gap-2 px-3 py-2.5">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-10 border border-neutral-200 px-3 py-2.5">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-11 w-full rounded-10" />
        </div>
      </aside>
    </div>

    <div className="fixed inset-x-0 bottom-0 z-[11] flex items-center justify-between gap-3 border-t border-neutral-200 bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 md:hidden">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-5 w-32 rounded" />
      </div>
      <Skeleton className="h-11 w-32 rounded-10" />
    </div>
  </div>
);

export default PropertyDetailsPageSkeleton;
