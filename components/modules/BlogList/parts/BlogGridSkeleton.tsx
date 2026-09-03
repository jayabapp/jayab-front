export const BlogGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-8 p-2 md:grid-cols-3" aria-hidden="true">
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="animate-pulse overflow-hidden rounded-20 border border-white bg-white motion-reduce:animate-none"
      >
        <div className="aspect-[16/9] bg-neutral-200" />
        <div className="flex flex-col gap-2.5 p-3 md:p-4">
          <div className="h-4 w-4/5 rounded bg-neutral-200" />
          <div className="h-3 w-full rounded bg-neutral-100" />
          <div className="h-3 w-2/3 rounded bg-neutral-100" />
          <div className="mt-1.5 flex items-center justify-between border-t border-neutral-100 pt-2.5">
            <div className="h-2.5 w-24 rounded bg-neutral-100" />
            <div className="h-2.5 w-16 rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
