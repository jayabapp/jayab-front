const SupportCardSkeleton = () => (
  <div
    className="flex animate-pulse flex-col gap-4 rounded-20 border bg-white p-4 motion-reduce:animate-none dark:bg-zinc-800"
    aria-hidden="true"
  >
    <div className="h-5 w-2/5 rounded bg-zinc-200" />
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-zinc-200" />
      <div className="h-3 w-4/5 rounded bg-zinc-200" />
    </div>
    <div className="flex items-center justify-between">
      <div className="h-7 w-20 rounded bg-zinc-200" />
      <div className="h-3 w-24 rounded bg-zinc-200" />
    </div>
  </div>
);

export default SupportCardSkeleton;
