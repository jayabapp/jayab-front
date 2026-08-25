const TicketDetailsSkeleton = () => (
  <div className="flex animate-pulse flex-col gap-4" role="status" aria-label="در حال دریافت تیکت">
    <div className="h-32 w-full rounded-lg bg-zinc-200" />
    <div className="h-24 w-4/5 self-end rounded-lg bg-zinc-200" />
    <div className="h-24 w-4/5 rounded-lg bg-zinc-200" />
  </div>
);

export default TicketDetailsSkeleton;
