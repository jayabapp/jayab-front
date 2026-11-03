export const BlogGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-8 p-2 md:grid-cols-3" aria-hidden="true">
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="animate-pulse overflow-hidden rounded-20 border border-white bg-surface motion-reduce:animate-none"
      >
        <div className="aspect-[16/9] bg-surface-hover" />
        <div className="flex flex-col gap-2.5 p-3 md:p-4">
          <div className="h-4 w-4/5 rounded bg-surface-hover" />
          <div className="h-3 w-full rounded bg-surface-muted" />
          <div className="h-3 w-2/3 rounded bg-surface-muted" />
          <div className="mt-1.5 flex items-center justify-between border-t border-surface-muted pt-2.5">
            <div className="h-2.5 w-24 rounded bg-surface-muted" />
            <div className="h-2.5 w-16 rounded bg-surface-hover" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
