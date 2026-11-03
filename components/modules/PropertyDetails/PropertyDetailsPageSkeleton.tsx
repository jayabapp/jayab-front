import { PropertyGallerySkeleton } from "@modules/PropertyGallery";
import { PageSurface } from "@elements/PageSurface";

import Skeleton from "@elements/Skeleton/Skeleton";

const ACTION_COUNT = 4;
const TAB_COUNT = 5;
const FACT_COUNT = 4;
const AMENITY_COUNT = 6;

const SECTION_CLASS = "flex flex-col gap-5 border-b border-line py-8 md:py-10";

const PropertyDetailsPageSkeleton = () => (
  <div
    aria-busy="true"
    className="container flex !h-auto flex-col !overflow-x-visible !bg-surface !pb-28 md:!pb-36 xl:!px-4"
  >
    <PageSurface />

    <div className="mx-auto flex w-full max-w-6xl flex-col">
      <header className="order-2 flex flex-col gap-3 pt-4 md:order-1 md:pb-6 md:pt-0">
        <Skeleton className="h-4 w-56 rounded" />

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="flex min-w-0 flex-col gap-3">
            <Skeleton className="h-8 w-4/5 rounded md:h-10 md:w-96" />
            <Skeleton className="h-4 w-40 rounded" />
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: ACTION_COUNT }, (_, index) => (
              <Skeleton
                key={index}
                className={`h-11 rounded-full ${index === 0 ? "w-24" : "w-12"}`}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="order-1 w-full md:order-2">
        <PropertyGallerySkeleton />
      </div>

      <div className="order-3 grid grid-cols-1 gap-x-12 pt-6 md:grid-cols-12 md:pt-8">
        <div className="flex w-full min-w-0 flex-col md:col-span-7 lg:col-span-8">
          <div className="flex items-center gap-2 pb-5">
            <Skeleton className="size-10 shrink-0 rounded-full md:size-12" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-20 border border-line-strong bg-line lg:grid-cols-4">
            {Array.from({ length: FACT_COUNT }, (_, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 bg-surface p-4 lg:p-5"
              >
                <Skeleton className="size-6 rounded-md" />
                <Skeleton className="h-5 w-2/3 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-6 overflow-hidden border-b border-line py-3">
            {Array.from({ length: TAB_COUNT }, (_, index) => (
              <Skeleton key={index} className="h-5 w-16 shrink-0 rounded" />
            ))}
          </div>

          <section className={SECTION_CLASS}>
            <Skeleton className="h-6 w-36 rounded" />

            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-11/12 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {Array.from({ length: FACT_COUNT }, (_, index) => (
                <Skeleton key={index} className="h-24 rounded-10" />
              ))}
            </div>
          </section>

          <section className={SECTION_CLASS}>
            <Skeleton className="h-6 w-32 rounded" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: AMENITY_COUNT }, (_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="size-5 shrink-0 rounded-md" />
                  <Skeleton className="h-4 w-3/5 rounded" />
                </div>
              ))}
            </div>

            <Skeleton className="h-11 w-44 rounded-full" />
          </section>

          <section className={SECTION_CLASS}>
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-64 w-full rounded-20" />
          </section>
        </div>

        <aside className="hidden w-full md:col-span-5 md:block lg:col-span-4">
          <div className="flex w-full flex-col gap-4 rounded-20 border border-line-strong bg-surface p-5 shadow-elevated md:sticky md:top-24 lg:p-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-8 w-44 rounded" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex overflow-hidden rounded-10 border border-control">
                {Array.from({ length: 2 }, (_, index) => (
                  <div
                    key={index}
                    className={`flex flex-1 flex-col gap-2 px-3 py-2.5 ${index ? "border-s border-control" : ""}`}
                  >
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-10 border border-control px-3 py-2.5">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>

            <Skeleton className="h-12 w-full rounded-10" />
          </div>
        </aside>
      </div>
    </div>

    <div className="fixed inset-x-0 bottom-0 z-[11] flex items-center justify-between gap-3 border-t border-line bg-surface px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 md:hidden">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-6 w-32 rounded" />
      </div>
      <Skeleton className="h-12 w-32 rounded-10" />
    </div>
  </div>
);

export default PropertyDetailsPageSkeleton;
