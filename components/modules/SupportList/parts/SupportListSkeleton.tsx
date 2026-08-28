import SupportCardSkeleton from "./SupportCardSkeleton";

const SupportListSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2" role="status" aria-label="در حال دریافت تیکت‌ها">
    {Array.from({ length: 4 }, (_, index) => (
      <SupportCardSkeleton key={index} />
    ))}
  </div>
);

export default SupportListSkeleton;
