const HomePropertiesSkeleton = ({ count = 8 }: { count?: number }) => (
  <div
    className="grid grid-cols-2 gap-2.5 pb-8 pt-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4"
    aria-hidden="true"
  >
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="animate-pulse overflow-hidden rounded-20 border border-neutral-100 bg-white motion-reduce:animate-none"
      >
        <div className="aspect-[4/3] w-full bg-neutral-200" />
        <div className="flex flex-col gap-2 p-2.5 md:p-3">
          <div className="h-3.5 w-4/5 rounded bg-neutral-200" />
          <div className="h-3 w-2/5 rounded bg-neutral-100" />
          <div className="mt-1 h-4 w-3/5 rounded bg-neutral-200" />
        </div>
      </div>
    ))}
  </div>
);

export default HomePropertiesSkeleton;
