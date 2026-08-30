import Skeleton from "@elements/Skeleton/Skeleton";

const THUMBNAIL_COUNT = 4;

const PropertyGallerySkeleton = () => (
  <div className="w-full gap-2 flex flex-row" aria-hidden="true">
    <div className="h-full hidden md:flex w-0 md:w-[17%] flex-col gap-2 justify-between">
      {Array.from({ length: THUMBNAIL_COUNT }, (_, index) => (
        <Skeleton key={index} className="w-full aspect-square rounded-20" />
      ))}
    </div>
    <div className="w-full md:w-4/5">
      <Skeleton className="w-full aspect-square rounded-20" />
    </div>
  </div>
);

export default PropertyGallerySkeleton;
