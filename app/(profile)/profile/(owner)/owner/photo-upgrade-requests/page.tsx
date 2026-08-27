"use client";

import { usePhotoUpgradeRequests } from "@features/photo-upgrade/hooks/usePhotoUpgradeRequests";

import PhotoUpgradeRequestCardSkeleton from "@features/photo-upgrade/components/PhotoUpgradeRequestCardSkeleton";
import PhotoUpgradeRequestCard from "@/components/profile/photo-upgrade/PhotoUpgradeRequestCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";

const OwnerPhotoUpgradeRequestsPage = () => {
  const { data = [], isPending, isError, refetch } = usePhotoUpgradeRequests();

  return (
    <div
      id="homeParent"
      className="profile-container flex flex-col gap-4 transition-all duration-500 ease-in-out"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-medium md:text-xl">
          درخواست های بهبود تصویر
        </h1>
        <p className="text-xs text-gray-500 md:text-sm">
          وضعیت درخواست ها و نتیجه ویرایش هر تصویر را اینجا ببینید.
        </p>
      </div>
      {isPending ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <PhotoUpgradeRequestCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="white-card flex flex-col items-center gap-3 text-sm text-gray-500">
          <p>دریافت درخواست‌ها ناموفق بود.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="text-primary-700"
          >
            تلاش دوباره
          </button>
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {data.map((item) => (
            <PhotoUpgradeRequestCard
              data={item}
              key={`photoUpgradeRequest${item.id}`}
            />
          ))}
        </div>
      ) : (
        <EmptyList />
      )}
    </div>
  );
};

export default OwnerPhotoUpgradeRequestsPage;
