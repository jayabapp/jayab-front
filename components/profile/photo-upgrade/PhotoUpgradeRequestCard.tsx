"use client";

import { PhotoUpgradeRequestDto } from "@/api_services/photo-upgrade/photo-upgrade.interface";
import StatusShower from "@/components/shared/StatusShower";
import numberWithCommas from "@/helpers/numberWithCommas";
import { NEW_IMAGE_URL } from "@/utils/urls";
import moment from "moment-jalaali";
import Link from "next/link";

const InfoItem = ({ title, value }: { title: string; value: string | number }) => (
  <div className="flex items-center justify-between gap-2 text-xs md:text-sm">
    <span className="text-gray-500">{title}</span>
    <span className="font-medium text-primary-text">{value}</span>
  </div>
);

const PhotoUpgradeRequestCard = ({ data }: { data: PhotoUpgradeRequestDto }) => {
  return (
    <Link
      prefetch={false}
      href={`/profile/owner/photo-upgrade-requests/${data.id}`}
      className="property-card-shadow flex flex-col  rounded-20 gap-4 overflow-hidden"
    >
      <div className="flex items-start gap-3 p-3">
        <img
          src={NEW_IMAGE_URL(data?.property?.feature_image)}
          alt={data?.property?.title || ""}
          className="h-20 w-20 shrink-0 rounded-10 object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-medium md:text-base">{data?.property?.title || "اقامتگاه"}</p>
              <p className="mt-1 text-xs text-gray-500">کد {data?.property?.code || data?.property_id}</p>
            </div>
            <StatusShower data={data?.status} containerClass="shrink-0 !px-2 !py-1" />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <InfoItem title="تعداد عکس" value={`${data?.image_count || data?._count?.items || 0} عکس`} />
            <InfoItem title="مبلغ کل" value={`${numberWithCommas(data?.total_amount)} تومان`} />
            <InfoItem title="تاریخ ثبت" value={moment(data?.created_at).format("HH:mm - jYYYY/jMM/jDD")} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PhotoUpgradeRequestCard;
