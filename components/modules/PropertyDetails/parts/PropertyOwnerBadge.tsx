import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { PropertyOwnerBadgeProps } from "@/types/components/modules/property-details";

const OWNER_AVATAR_FALLBACK = "/assets/images/add/wall_e_lover.png";

const PropertyOwnerBadge = ({
  name,
  avatar,
  isOnline = false,
}: PropertyOwnerBadgeProps) => {
  const t = useTranslations();

  return (
    <div className="flex min-w-0 flex-row items-center gap-2">
      <div className="relative shrink-0">
        <ContentImage
          width={48}
          height={48}
          alt={name || t("common.host")}
          fallbackSrc={OWNER_AVATAR_FALLBACK}
          sizes="(min-width: 768px) 48px, 40px"
          src={avatar ? getPropertyImageUrl(avatar) : OWNER_AVATAR_FALLBACK}
          className="size-10 aspect-square rounded-full object-cover md:size-12"
        />
        {isOnline ? (
          <span
            role="status"
            aria-label={t("listing.online")}
            className="absolute -bottom-0.5 -end-0.5 size-3 rounded-full border-2 border-surface bg-status-success"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <p className="text-xs text-ink-subtle">
          {t("common.host")}
          {isOnline ? (
            <>
              {" - "}
              <span className="text-status-success">{t("listing.online")}</span>
            </>
          ) : null}
        </p>
        {name ? (
          <p className="break-words text-sm font-bold text-ink">
            <bdi>{name}</bdi>
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PropertyOwnerBadge;
