"use client";

import { PhotoUpgradeService } from "@/api_services/photo-upgrade/photo-upgrade.service";
import PhotoUpgradeImagePair from "@/components/profile/photo-upgrade/PhotoUpgradeImagePair";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import StatusShower from "@/components/shared/StatusShower";
import numberWithCommas from "@/helpers/numberWithCommas";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";
import moment from "moment-jalaali";
import { useParams } from "next/navigation";

const SummaryItem = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-between gap-2 rounded-10 bg-gray-50 px-3 py-2 text-xs md:text-sm">
    <span className="text-gray-500">{title}</span>
    <span className="font-medium text-primary-text">{value}</span>
  </div>
);

const OwnerPhotoUpgradeRequestPage = () => {
  const params = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: [
      PhotoUpgradeService.OWNER_PHOTO_UPGRADE_REQUEST_CACHEKEY,
      params.id,
    ],
    queryFn: () => PhotoUpgradeService.ownerRequest({ id: params.id }),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading) return <LottieLoading />;

  return (
    <div
      id="homeParent"
      className="profile-container flex flex-col gap-4 transition-all duration-500 ease-in-out"
    >
      {/* <Link prefetch={false} href="/profile/owner/photo-upgrade-requests" className="text-sm font-medium text-primary-700">
        بازگشت به درخواست ها
      </Link> */}
      <div className="white-card flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <img
            src={NEW_IMAGE_URL(data?.property?.feature_image, "medium")}
            alt={data?.property?.title || ""}
            className="h-20 w-20 shrink-0 rounded-10 object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <h1 className="line-clamp-1 text-base font-medium md:text-xl">
                  {data?.property?.title || "اقامتگاه"}
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                  کد {data?.property?.code || data?.property_id}
                </p>
              </div>
              {data?.status ? (
                <StatusShower
                  data={data.status}
                  containerClass="shrink-0 !px-2 !py-1"
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 ">
          <SummaryItem
            title="تعداد عکس"
            value={`${data?.image_count || data?._count?.items || 0} عکس`}
          />
          <SummaryItem
            title="قیمت هر عکس"
            value={`${numberWithCommas(data?.price_per_image)} تومان`}
          />
          <SummaryItem
            title="مبلغ کل"
            value={`${numberWithCommas(data?.total_amount)} تومان`}
          />
          <SummaryItem
            title="ثبت درخواست"
            value={
              data?.created_at
                ? moment(data.created_at).format("HH:mm - jYYYY/jMM/jDD")
                : "-"
            }
          />
          <SummaryItem
            title="تکمیل درخواست"
            value={
              data?.completed_at
                ? moment(data.completed_at).format("HH:mm - jYYYY/jMM/jDD")
                : "-"
            }
          />
        </div>
      </div>
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-3">
        {data?.items && data.items.length > 0 ? (
          data.items.map((item, index) => (
            <PhotoUpgradeImagePair
              item={item}
              index={index}
              key={`photoUpgradeRequestItem${item.id}`}
            />
          ))
        ) : (
          <div className="white-card text-center text-sm text-gray-500">
            تصویری برای این درخواست ثبت نشده است.
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerPhotoUpgradeRequestPage;
