const AdvisorCardSkeleton = () => (
  <div className="flex min-h-52 w-full animate-pulse flex-col gap-4 rounded-2xl p-4 shadow-card">
    <div className="flex gap-3">
      <div className="size-24 rounded-full bg-neutral-200" />
      <div className="flex flex-1 flex-col gap-3 py-2">
        <div className="h-4 w-1/2 rounded bg-neutral-200" />
        <div className="h-14 w-full rounded bg-neutral-100" />
        <div className="h-3 w-2/3 rounded bg-neutral-100" />
      </div>
    </div>
    <div className="h-4 w-4/5 rounded bg-neutral-100" />
  </div>
);
export default AdvisorCardSkeleton;
