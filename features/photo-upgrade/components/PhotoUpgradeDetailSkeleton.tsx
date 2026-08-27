const PhotoUpgradeDetailSkeleton = () => (
  <div className="profile-container flex animate-pulse flex-col gap-4">
    <div className="h-44 rounded-20 bg-neutral-100" />
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <div className="aspect-[8/3] rounded-20 bg-neutral-100" />
      <div className="aspect-[8/3] rounded-20 bg-neutral-100" />
    </div>
  </div>
);
export default PhotoUpgradeDetailSkeleton;
