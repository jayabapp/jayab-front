const PhotoUpgradeRequestCardSkeleton = () => (
  <div className="flex min-h-44 animate-pulse gap-3 rounded-20 p-3 shadow-surface motion-reduce:animate-none">
    <div className="size-20 shrink-0 rounded-10 bg-surface-hover" />
    <div className="flex flex-1 flex-col gap-3">
      <div className="h-5 w-1/2 rounded bg-surface-hover" />
      <div className="h-4 w-1/4 rounded bg-surface-muted" />
      <div className="h-16 rounded bg-surface-muted" />
    </div>
  </div>
);
export default PhotoUpgradeRequestCardSkeleton;
