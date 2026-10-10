"use client";

import { PROPERTY_IMAGE_QUALITY } from "@features/properties/constants/image";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useTranslations } from "next-intl";
import { useFormatToman } from "@hooks/useFormatToman";

import type { PhotoUpgradeRequestCardProps } from "@/types/components/modules/photo-upgrade";
import type { PhotoUpgradeInfoItemProps } from "@/types/components/modules/photo-upgrade";

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
  const formatToman = useFormatToman();

  const t = useTranslations();

  return (
    <Link
      prefetch={false}
      href={`/profile/owner/photo-upgrade-requests/${data.id}`}
      className="property-card-shadow flex flex-col  rounded-20 gap-4 overflow-hidden"
    >
      <div className="flex items-start gap-3 p-3">
        <Image
          width={80}
          height={80}
          sizes="80px"
          quality={PROPERTY_IMAGE_QUALITY}
          alt={data?.property?.title || t("owner.propertyImage")}
          className="h-20 w-20 shrink-0 rounded-10 object-cover"
          src={getPropertyImageUrl(data?.property?.feature_image)}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-medium md:text-base">
                {data?.property?.title || t("common.property")}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {t("common.code")} {data?.property?.code || data?.property_id}
              </p>
            </div>
            <StatusShower
              data={data?.status}
              containerClass="shrink-0 !px-2 !py-1"
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <InfoItem
              title={t("owner.photoCount")}
              value={t("owner.photosCount", {
                count: Number(data?.image_count || data?._count?.items || 0),
              })}
            />
            <InfoItem
              title={t("owner.totalAmount")}
              value={formatToman(data?.total_amount)}
            />
            <InfoItem
              title={t("owner.submittedAt")}
              value={moment(data?.created_at).format("HH:mm - jYYYY/jMM/jDD")}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PhotoUpgradeRequestCard;
