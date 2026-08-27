const ReservationCardSkeleton = () => (
  <div className="w-full animate-pulse space-y-4 rounded-2xl p-3 shadow-card">
    <div className="flex gap-3">
      <div className="size-24 rounded-xl bg-zinc-200" />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-3/4 rounded bg-zinc-200" />
        <div className="h-3 w-1/2 rounded bg-zinc-200" />
      </div>
    </div>
    <div className="h-px bg-zinc-200" />
    {Array.from({ length: 3 }, (_, index) => (
      <div key={index} className="h-3 w-full rounded bg-zinc-200" />
    ))}
    <div className="h-10 w-full rounded-xl bg-zinc-200" />
  </div>
);
export default ReservationCardSkeleton;
