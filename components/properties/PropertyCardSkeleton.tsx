const PropertyCardSkeleton = () => (
  <div
    className="flex min-h-48 animate-pulse flex-col justify-between gap-3 rounded-20 p-3 shadow-sm"
    aria-hidden="true"
  >
    <div className="flex gap-3">
      <div className="h-28 w-2/5 rounded-10 bg-zinc-200" />
      <div className="flex grow flex-col gap-3">
        <div className="h-4 w-4/5 rounded bg-zinc-200" />
        <div className="h-3 w-3/5 rounded bg-zinc-200" />
        <div className="h-3 w-2/5 rounded bg-zinc-200" />
      </div>
    </div>
    <div className="h-8 w-full rounded bg-zinc-200" />
  </div>
);

export default PropertyCardSkeleton;
