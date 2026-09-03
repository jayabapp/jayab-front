import Skeleton from "@elements/Skeleton/Skeleton";

// One boundary for the whole profile sub-tree. The sidebar lives in
// app/(profile)/layout.tsx, above this segment, so it stays on screen and only
// the content column swaps — which is what makes moving between profile tabs
// feel like a panel changing rather than the page reloading.
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
          className="flex flex-col gap-3 rounded-20 border border-white bg-white p-4"
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
