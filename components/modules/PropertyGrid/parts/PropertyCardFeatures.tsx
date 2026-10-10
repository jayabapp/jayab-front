import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { PropertyCardFeaturesProps } from "@/types/components/modules/property-grid";
import type { TFeatureItem } from "@/types/components/modules/property-discovery";

const FeatureItem = ({ disabled, iconUrl, title }: TFeatureItem) => (
  <div
    className={`flex items-center gap-1 justify-center ${disabled ? "grayscale opacity-80" : ""}`}
  >
    <div className="size-5 p-[1px] flex items-center justify-center">
      <ContentImage
        alt=""
        width={20}
        height={20}
        src={iconUrl}
        className="w-full h-full"
      />
    </div>
    <p className="text-xs">{title}</p>
  </div>
);

const PropertyCardFeatures = ({ data }: PropertyCardFeaturesProps) => {
  const t = useTranslations();

  return (
    <div className="flex min-w-0 items-center justify-start gap-4">
      <FeatureItem
        iconUrl="/assets/icons/adds/max_cap_house.svg"
        title={`${t("listing.upTo")} ${t("common.people", { count: Number(data?.max_capacity) })}`}
      />
      <FeatureItem
        iconUrl="/assets/icons/adds/prop_card_bed.svg"
        title={`${t("listing.roomsCount", { count: Number(data?.total_bedrooms) })}`}
      />
      <FeatureItem
        disabled={!data?.has_pool}
        iconUrl="/assets/icons/adds/prop_card_pool.svg"
        title={data?.has_pool ? t("listing.hasPool") : t("listing.poolLess")}
      />
    </div>
  );
};

export default PropertyCardFeatures;
