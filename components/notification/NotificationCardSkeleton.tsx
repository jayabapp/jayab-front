const NotificationCardSkeleton = () => (
  <div
    className="flex animate-pulse flex-col gap-4 rounded-20 bg-white/60 px-3 py-3 shadow-sm"
    aria-hidden="true"
  >
    <div className="flex items-start gap-3">
      <div className="h-5 w-5 shrink-0 rounded-full bg-zinc-200" />
      <div className="flex w-full flex-col gap-2">
        <div className="h-4 w-2/5 rounded bg-zinc-200" />
        <div className="h-3 w-4/5 rounded bg-zinc-200" />
      </div>
    </div>
    <div className="h-3 w-28 self-end rounded bg-zinc-200" />
  </div>
);

export default NotificationCardSkeleton;
