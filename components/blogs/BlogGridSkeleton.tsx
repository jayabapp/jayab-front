export const BlogGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-8 p-2 md:grid-cols-3" aria-hidden="true">
    {Array.from({ length: count }, (_, index) => (
      <div
        className="animate-pulse overflow-hidden rounded-2xl border motion-reduce:animate-none"
        key={index}
      >
        <div className="aspect-[1.5] bg-gray-200" />
        <div className="flex flex-col gap-3 p-4">
          <div className="h-4 w-4/5 rounded bg-gray-200" />
          <div className="h-3 w-full rounded bg-gray-100" />
          <div className="h-3 w-2/3 rounded bg-gray-100" />
        </div>
      </div>
    ))}
  </div>
);
