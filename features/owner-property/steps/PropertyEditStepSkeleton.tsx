const PropertyEditStepSkeleton = ({
  variant = "form",
}: {
  variant?: "form" | "map" | "media";
}) => (
  <div
    className="w-full animate-pulse space-y-5 px-4 py-6 motion-reduce:animate-none"
    aria-label="در حال بارگذاری فرم"
  >
    <div className="h-5 w-1/3 rounded bg-neutral-200" />
    {variant === "map" ? (
      <div className="h-[55dvh] w-full rounded-2xl bg-neutral-200" />
    ) : null}
    {variant === "media" ? (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="aspect-square rounded-xl bg-neutral-200" />
        ))}
      </div>
    ) : null}
    {variant === "form"
      ? Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 w-1/4 rounded bg-neutral-200" />
            <div className="h-12 w-full rounded-xl bg-neutral-200" />
          </div>
        ))
      : null}
  </div>
);
export default PropertyEditStepSkeleton;
