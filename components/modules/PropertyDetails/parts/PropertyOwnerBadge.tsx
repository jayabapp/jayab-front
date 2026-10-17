import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { CallBadge } from "@elements/Badge";

import type { PropertyOwnerBadgeProps } from "@/types/components/modules/property-details";

const OWNER_AVATAR_FALLBACK = "/assets/images/add/wall_e_lover.png";

const PropertyOwnerBadge = ({
  name,
  nameLang,
  avatar,
  isOnline = false,
}: PropertyOwnerBadgeProps) => {
  const t = useTranslations();

  return (
    <div className="flex min-w-0 flex-row items-center gap-3">
      <div className="relative shrink-0">
        <ContentImage
          width={56}
          height={56}
          alt={name || t("common.host")}
          fallbackSrc={OWNER_AVATAR_FALLBACK}
          sizes="(min-width: 768px) 56px, 48px"
          src={avatar ? getPropertyImageUrl(avatar) : OWNER_AVATAR_FALLBACK}
          className="size-12 aspect-square rounded-full object-cover md:size-14"
        />
        {isOnline ? (
          <CallBadge
            size="sm"
            label={t("listing.activeSubscription")}
            className="absolute -end-0.5 -top-0.5"
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
          <p lang={nameLang} className="break-words text-sm font-bold text-ink">
            <bdi>{name}</bdi>
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PropertyOwnerBadge;
