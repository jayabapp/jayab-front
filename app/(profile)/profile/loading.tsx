import Skeleton from "@elements/Skeleton/Skeleton";

const ROWS = 5;

const ProfileLoading = () => (
  <main
    aria-busy="true"
    className="route-enter profile-container flex flex-col gap-4 transition-all duration-500 ease-in-out"
  >
    <Skeleton className="h-7 w-48 rounded" />

    <div className="flex flex-col gap-3">
      {Array.from({ length: ROWS }, (_, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-20 border border-white bg-surface p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-2/5 rounded" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-3/5 rounded" />
        </div>
      ))}
    </div>
  </main>
);

export default ProfileLoading;
