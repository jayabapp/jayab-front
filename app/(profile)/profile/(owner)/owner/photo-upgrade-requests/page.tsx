"use client";

import { PhotoUpgradeRequestDto } from "@/api_services/photo-upgrade/photo-upgrade.interface";
import { PhotoUpgradeService } from "@/api_services/photo-upgrade/photo-upgrade.service";
import PhotoUpgradeRequestCard from "@/components/profile/photo-upgrade/PhotoUpgradeRequestCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { useQuery } from "@tanstack/react-query";

const OwnerPhotoUpgradeRequestsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: [PhotoUpgradeService.OWNER_PHOTO_UPGRADE_REQUESTS_CACHEKEY],
    queryFn: () => PhotoUpgradeService.ownerRequests(),
    staleTime: 0,
    gcTime: 0,
  });

  return (
    <div id="homeParent" className="profile-container flex flex-col gap-4 transition-all duration-500 ease-in-out">
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-medium md:text-xl">درخواست های بهبود تصویر</h1>
        <p className="text-xs text-gray-500 md:text-sm">وضعیت درخواست ها و نتیجه ویرایش هر تصویر را اینجا ببینید.</p>
      </div>
      {isLoading ? (
        <LottieLoading />
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {data.map((item: PhotoUpgradeRequestDto) => (
            <PhotoUpgradeRequestCard data={item} key={`photoUpgradeRequest${item.id}`} />
          ))}
        </div>
      ) : (
        <EmptyList />
      )}
    </div>
  );
};

export default OwnerPhotoUpgradeRequestsPage;
