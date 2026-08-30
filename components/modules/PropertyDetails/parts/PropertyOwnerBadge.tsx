import type { PropertyOwnerBadgeProps } from "@/types/components/modules/property-details";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { ContentImage } from "@elements/Image";

import AutoFitText from "@/components/shared/AutoFitText";
import _STRINGS from "@/utils/LocalStrings";

const OWNER_AVATAR_FALLBACK = "/assets/images/add/wall_e_lover.png";

const PropertyOwnerBadge = ({ avatar, name }: PropertyOwnerBadgeProps) => (
  <div className="flex flex-row items-center gap-2">
    <ContentImage
      width={48}
      height={48}
      alt={name || _STRINGS.HOST}
      sizes="(min-width: 768px) 48px, 40px"
      className="size-10 aspect-square rounded-full md:size-12"
      src={avatar ? getPropertyImageUrl(avatar) : OWNER_AVATAR_FALLBACK}
    />
    <div className="flex flex-col items-start gap-1">
      <p className="text-sm font-bold text-brand-600">{_STRINGS.HOST}</p>
      {name ? (
        <div className="relative w-36">
          <AutoFitText
            text={name}
            maxFontSize={14}
            minFontSize={10}
            className="w-36 text-sm font-medium text-brand-600"
          />
        </div>
      ) : null}
    </div>
  </div>
);

export default PropertyOwnerBadge;
