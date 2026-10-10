"use client";

import { usePhotoUpgradeRequests } from "@features/photo-upgrade/hooks/usePhotoUpgradeRequests";
import { useTranslations } from "next-intl";

import PhotoUpgradeRequestCardSkeleton from "@features/photo-upgrade/components/PhotoUpgradeRequestCardSkeleton";
import PhotoUpgradeRequestCard from "./PhotoUpgradeRequestCard.client";
import EmptyState from "@elements/EmptyState";

const OwnerPhotoUpgradeList = () => {
  const t = useTranslations();

  const { data = [], isPending, isError, refetch } = usePhotoUpgradeRequests();

  return (
    <div
      id="homeParent"
      className="profile-container flex flex-col gap-4 transition-all duration-500 ease-in-out"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-medium md:text-xl">
          {t("owner.photoUpgradeRequests")}
        </h1>
        <p className="text-xs text-neutral-500 md:text-sm">
          {t("owner.photoUpgradeHint")}
        </p>
      </div>
      {isPending ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <PhotoUpgradeRequestCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="white-card flex flex-col items-center gap-3 text-sm text-neutral-500">
          <p>{t("owner.requestsLoadFailed")}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="text-brand-600"
          >
            {t("common.tryAgain")}
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
        <EmptyState />
      )}
    </div>
  );
};

export default OwnerPhotoUpgradeList;
