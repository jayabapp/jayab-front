"use client";

import type { PhotoUpgradeInfoItemProps, PhotoUpgradeRequestCardProps } from "@/types/components/modules/photo-upgrade";
import { NEW_IMAGE_URL } from "@/utils/urls";

import numberWithCommas from "@/helpers/numberWithCommas";
import StatusShower from "@elements/StatusShower";
import moment from "moment-jalaali";
import Image from "next/image";
import Link from "next/link";

const InfoItem = ({ title, value }: PhotoUpgradeInfoItemProps) => (
  <div className="flex items-center justify-between gap-2 text-xs md:text-sm">
    <span className="text-neutral-500">{title}</span>
    <span className="font-medium text-neutral-900">{value}</span>
  </div>
);

const PhotoUpgradeRequestCard = ({ data }: PhotoUpgradeRequestCardProps) => {
  return (
    <Link
      prefetch={false}
      href={`/profile/owner/photo-upgrade-requests/${data.id}`}
      className="property-card-shadow flex flex-col  rounded-20 gap-4 overflow-hidden"
    >
      <div className="flex items-start gap-3 p-3">
        <Image
          src={
            NEW_IMAGE_URL(data?.property?.feature_image, "medium") ||
            "/assets/icons/shared/image_placeholder.svg"
          }
          alt={data?.property?.title || "تصویر اقامتگاه"}
          width={80}
          height={80}
          sizes="80px"
          className="h-20 w-20 shrink-0 rounded-10 object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-medium md:text-base">
                {data?.property?.title || "اقامتگاه"}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                کد {data?.property?.code || data?.property_id}
              </p>
            </div>
            <StatusShower
              data={data?.status}
              containerClass="shrink-0 !px-2 !py-1"
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <InfoItem
              title="تعداد عکس"
              value={`${data?.image_count || data?._count?.items || 0} عکس`}
            />
            <InfoItem
              title="مبلغ کل"
              value={`${numberWithCommas(data?.total_amount)} تومان`}
            />
            <InfoItem
              title="تاریخ ثبت"
              value={moment(data?.created_at).format("HH:mm - jYYYY/jMM/jDD")}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PhotoUpgradeRequestCard;
