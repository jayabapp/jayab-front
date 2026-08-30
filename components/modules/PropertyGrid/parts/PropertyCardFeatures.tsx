import type { PropertyCardFeaturesProps } from "@/types/components/modules/property-grid";
import type { TFeatureItem } from "@/types/components/modules/property-discovery";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";

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

const PropertyCardFeatures = ({ data }: PropertyCardFeaturesProps) => (
  <div className="w-full flex justify-start gap-4 items-center">
    <FeatureItem
      iconUrl="/assets/icons/adds/max_cap_house.svg"
      title={`${_STRINGS.UP_TO} ${data?.max_capacity} ${_STRINGS.PERSON}`}
    />
    <FeatureItem
      iconUrl="/assets/icons/adds/prop_card_bed.svg"
      title={`${data?.total_bedrooms} ${_STRINGS.ROOM}`}
    />
    <FeatureItem
      disabled={!data?.has_pool}
      iconUrl="/assets/icons/adds/prop_card_pool.svg"
      title={data?.has_pool ? _STRINGS.HAS_POOL : _STRINGS.POOL_LESS}
    />
  </div>
);

export default PropertyCardFeatures;
