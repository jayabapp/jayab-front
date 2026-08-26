export const SuggestionRowSkeleton = () => (
  <div className="flex w-full animate-pulse flex-col gap-3 px-4 py-3" aria-hidden="true">
    {[0, 1, 2, 3].map((item) => (
      <div className="flex items-center gap-3" key={item}>
        <div className="size-4 rounded-full bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
      </div>
    ))}
  </div>
);
