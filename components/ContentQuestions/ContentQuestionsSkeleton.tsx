export const ContentQuestionsSkeleton = () => (
  <div
    className="flex w-full animate-pulse flex-col gap-4 motion-reduce:animate-none"
    aria-hidden="true"
  >
    {[0, 1, 2].map((item) => (
      <div className="flex flex-col gap-2 rounded-xl border p-4" key={item}>
        <div className="h-4 w-1/3 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-2/3 rounded bg-gray-100" />
      </div>
    ))}
  </div>
);
