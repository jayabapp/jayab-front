const CityRowSkeleton = () => (
  <div
    className="flex w-full animate-pulse flex-col gap-4 p-3 motion-reduce:animate-none"
    aria-hidden="true"
  >
    {[0, 1, 2, 3, 4].map((item) => (
      <div className="flex items-center gap-4" key={item}>
        <div className="size-10 rounded-md bg-surface-hover" />
        <div className="flex grow flex-col gap-2">
          <div className="h-4 w-1/3 rounded bg-surface-hover" />
          <div className="h-3 w-2/3 rounded bg-surface-muted" />
        </div>
      </div>
    ))}
  </div>
);

export default CityRowSkeleton;
