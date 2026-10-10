const SupportCardSkeleton = () => (
  <div
    className="flex animate-pulse flex-col gap-4 rounded-20 border bg-surface p-4 motion-reduce:animate-none "
    aria-hidden="true"
  >
    <div className="h-5 w-2/5 rounded bg-surface-hover" />
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-surface-hover" />
      <div className="h-3 w-4/5 rounded bg-surface-hover" />
    </div>
    <div className="flex items-center justify-between">
      <div className="h-7 w-20 rounded bg-surface-hover" />
      <div className="h-3 w-24 rounded bg-surface-hover" />
    </div>
  </div>
);

export default SupportCardSkeleton;
