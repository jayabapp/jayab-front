import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { PropertyOwnerBadgeProps } from "@/types/components/modules/property-details";

import AutoFitText from "@elements/AutoFitText";

const OWNER_AVATAR_FALLBACK = "/assets/images/add/wall_e_lover.png";

const PropertyOwnerBadge = ({
  name,
  avatar,
  isOnline = false,
}: PropertyOwnerBadgeProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="relative shrink-0">
        <ContentImage
          width={48}
          height={48}
          alt={name || t("common.host")}
          sizes="(min-width: 768px) 48px, 40px"
          className="size-10 aspect-square rounded-full md:size-12"
          src={avatar ? getPropertyImageUrl(avatar) : OWNER_AVATAR_FALLBACK}
        />
        {isOnline ? (
          <span
            role="status"
            aria-label={t("listing.online")}
            className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.9)]"
          />
        ) : null}
      </div>
      <div className="flex flex-col items-start gap-1">
        <p className="text-xs text-ink-subtle">
          {t("common.host")}
          {isOnline ? ` - ${t("listing.online")}` : null}
        </p>
        {name ? (
          <div className="relative w-36">
            <AutoFitText
              text={name}
              maxFontSize={14}
              minFontSize={10}
              className="w-36 text-sm font-bold text-ink"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PropertyOwnerBadge;
