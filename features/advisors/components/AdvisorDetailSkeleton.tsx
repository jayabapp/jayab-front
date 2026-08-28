const AdvisorDetailSkeleton = () => (
  <div className="flex animate-pulse flex-col gap-4 p-4 motion-reduce:animate-none">
    <div className="flex gap-3">
      <div className="size-24 rounded-full bg-neutral-200" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="h-5 w-1/2 rounded bg-neutral-200" />
        <div className="h-16 rounded bg-neutral-100" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="h-11 rounded-full bg-neutral-200" />
      <div className="h-11 rounded-full bg-neutral-200" />
    </div>
    <div className="h-24 rounded-xl bg-neutral-100" />
  </div>
);
export default AdvisorDetailSkeleton;
