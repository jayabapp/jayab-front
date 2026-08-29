const HomePropertiesSkeleton = ({ count = 8 }: { count?: number }) => (
  <div
    className="grid grid-cols-1 gap-2 pb-8 pt-2 md:grid-cols-2 md:gap-4 xl:grid-cols-4"
    aria-hidden="true"
  >
    {Array.from({ length: count }, (_, index) => (
      <div
        className="animate-pulse rounded-20 p-3 shadow motion-reduce:animate-none"
        key={index}
      >
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-3 flex flex-col gap-3">
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-3 w-2/3 rounded bg-neutral-100" />
            <div className="h-5 w-1/3 rounded-full bg-neutral-200" />
          </div>
          <div className="col-span-2 aspect-square rounded-2xl bg-neutral-200" />
        </div>
      </div>
    ))}
  </div>
);

export default HomePropertiesSkeleton;
