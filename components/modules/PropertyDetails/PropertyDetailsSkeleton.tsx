import { PropertyGallerySkeleton } from "@modules/PropertyGallery";

import Skeleton from "@elements/Skeleton/Skeleton";

const INTRO_ROWS = 4;
const SPEC_ROWS = 8;

const PropertyDetailsSkeleton = () => (
  <div
    aria-hidden="true"
    className="col-span-full pt-0 md:py-8 min-h-[30dvh] grid gap-4 w-full grid-cols-1 md:grid-cols-2"
  >
    <PropertyGallerySkeleton />

    <div className="w-full gap-6 flex flex-col">
      <Skeleton className="h-8 w-1/2 rounded-full" />
      <Skeleton className="h-8 w-1/2 rounded-full" />
      {Array.from({ length: INTRO_ROWS }, (_, index) => (
        <Skeleton key={index} className="h-8 w-full rounded-full" />
      ))}
      <div className="w-full flex items-center gap-4">
        <Skeleton className="h-8 w-1/2 rounded-full" />
        <Skeleton className="h-8 w-1/2 rounded-full" />
      </div>
    </div>

    <Skeleton className="w-full aspect-square rounded-20" />

    <div className="flex flex-col gap-4 w-full">
      {Array.from({ length: SPEC_ROWS }, (_, index) => (
        <Skeleton key={index} className="h-8 w-full rounded-full" />
      ))}
    </div>
  </div>
);

export default PropertyDetailsSkeleton;
