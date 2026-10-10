"use client";

import { usePhotoUpgradeRequest } from "@features/photo-upgrade/hooks/usePhotoUpgradeRequest";
import { PROPERTY_IMAGE_QUALITY } from "@features/properties/constants/image";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useTranslations } from "next-intl";
import { useFormatToman } from "@hooks/useFormatToman";

import type { PhotoUpgradeSummaryItemProps } from "@/types/components/modules/photo-upgrade";

import PhotoUpgradeDetailSkeleton from "@features/photo-upgrade/components/PhotoUpgradeDetailSkeleton";
import PhotoUpgradeImagePair from "./PhotoUpgradeImagePair.client";
import StatusShower from "@elements/StatusShower";
import moment from "moment-jalaali";
import Image from "next/image";

const SummaryItem = ({ title, value }: PhotoUpgradeSummaryItemProps) => (
  <div className="flex items-center justify-between gap-2 rounded-10 bg-surface-muted px-3 py-2 text-xs md:text-sm">
    <span className="text-ink-subtle">{title}</span>
    <span className="font-medium text-ink">{value}</span>
  </div>
);

const OwnerPhotoUpgradeDetails = ({ requestId }: { requestId: number }) => {
  const formatToman = useFormatToman();

  const t = useTranslations();

  const { data, isPending, isError, refetch } =
    usePhotoUpgradeRequest(requestId);

  if (!Number.isInteger(requestId) || requestId <= 0)
    return (
      <div className="profile-container white-card text-center text-sm text-ink-subtle">
        {t("owner.invalidRequestId")}
      </div>
    );
  if (isPending) return <PhotoUpgradeDetailSkeleton />;
  if (isError || !data)
    return (
      <div className="profile-container white-card flex flex-col items-center gap-3 text-center text-sm text-ink-subtle">
        <p>{t("owner.requestNotFound")}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="text-link"
        >
          {t("common.tryAgain")}
        </button>
      </div>
    );

  return (
    <div
      id="homeParent"
      className="profile-container flex flex-col gap-4 transition-all duration-500 ease-in-out"
    >
      <div className="white-card flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Image
            width={80}
            height={80}
            sizes="80px"
            quality={PROPERTY_IMAGE_QUALITY}
            alt={data?.property?.title || ""}
            className="h-20 w-20 shrink-0 rounded-10 object-cover"
            src={getPropertyImageUrl(data?.property?.feature_image)}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <h1 className="line-clamp-1 text-base font-medium md:text-xl">
                  {data?.property?.title || t("common.property")}
                </h1>
                <p className="mt-1 text-xs text-ink-subtle">
                  {t("common.code")} {data?.property?.code || data?.property_id}
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
            title={t("owner.photoCount")}
            value={t("owner.photosCount", {
              count: Number(data?.image_count || data?._count?.items || 0),
            })}
          />
          <SummaryItem
            title={t("owner.pricePerPhoto")}
            value={formatToman(data?.price_per_image)}
          />
          <SummaryItem
            title={t("owner.totalAmount")}
            value={formatToman(data?.total_amount)}
          />
          <SummaryItem
            title={t("owner.requestSubmitted")}
            value={
              data?.created_at
                ? moment(data.created_at).format("HH:mm - jYYYY/jMM/jDD")
                : "-"
            }
          />
          <SummaryItem
            title={t("owner.requestCompleted")}
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
          <div className="white-card text-center text-sm text-ink-subtle">
            {t("owner.noImagesForRequest")}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerPhotoUpgradeDetails;
