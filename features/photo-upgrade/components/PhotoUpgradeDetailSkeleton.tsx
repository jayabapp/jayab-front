const PhotoUpgradeDetailSkeleton = () => (
  <div className="profile-container flex animate-pulse flex-col gap-4 motion-reduce:animate-none">
    <div className="h-44 rounded-20 bg-surface-muted" />
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <div className="aspect-[8/3] rounded-20 bg-surface-muted" />
      <div className="aspect-[8/3] rounded-20 bg-surface-muted" />
    </div>
  </div>
);
export default PhotoUpgradeDetailSkeleton;
