import Skeleton from "@elements/Skeleton/Skeleton";

const THUMBNAIL_COUNT = 4;

// Mirrors PropertyGallery: a 2 + 4 bento grid on desktop, one 4:3 slide on mobile.
const PropertyGallerySkeleton = () => (
  <div className="w-full" aria-hidden="true">
    <div className="hidden aspect-[16/7] w-full grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-20 md:grid">
      <Skeleton className="col-span-2 row-span-2" />
      {Array.from({ length: THUMBNAIL_COUNT }, (_, index) => (
        <Skeleton key={index} />
      ))}
    </div>
    <Skeleton className="aspect-[4/3] w-full rounded-20 md:hidden" />
  </div>
);

export default PropertyGallerySkeleton;
