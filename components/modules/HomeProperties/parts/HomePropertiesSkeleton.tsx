// Mirrors the compact listing card the home grid now renders: one column on a
// phone, photo beside the text rather than above it. A skeleton that describes a
// different layout than the content replacing it produces a visible jump at the
// moment the data lands, which is the one thing a skeleton exists to prevent.
const HomePropertiesSkeleton = ({ count = 6 }: { count?: number }) => (
  <div
    aria-hidden="true"
    className="grid grid-cols-1 gap-2.5 pb-8 pt-2 md:grid-cols-2 md:gap-4 xl:grid-cols-3"
  >
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="animate-pulse rounded-20 border border-neutral-100 bg-white p-3 motion-reduce:animate-none"
      >
        <div className="grid w-full grid-cols-2 gap-2">
          <div className="flex flex-col justify-between gap-2">
            <div className="h-3.5 w-full rounded bg-neutral-200" />
            <div className="h-3 w-3/5 rounded bg-neutral-100" />
            <div className="h-4 w-4/5 rounded bg-neutral-200" />
          </div>
          <div className="aspect-square w-full rounded-2xl bg-neutral-200" />
        </div>
        <div className="mt-3 h-3 w-2/3 rounded bg-neutral-100" />
      </div>
    ))}
  </div>
);

export default HomePropertiesSkeleton;
