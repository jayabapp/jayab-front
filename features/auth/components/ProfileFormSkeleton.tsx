const ProfileFormSkeleton = () => (
  <div className="flex w-full animate-pulse flex-col gap-6">
    <div className="flex items-center gap-3">
      <div className="size-20 rounded-full bg-neutral-200" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="h-4 w-1/3 rounded bg-neutral-200" />
        <div className="h-3 w-1/2 rounded bg-neutral-100" />
      </div>
    </div>
    <div className="h-12 w-full rounded-xl bg-neutral-100" />
    <div className="h-12 w-full rounded-xl bg-neutral-100" />
    <div className="h-12 w-full rounded-xl bg-neutral-100" />
  </div>
);

export default ProfileFormSkeleton;
