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
          sizes="(min-width: 768px) 48px, 40px"
          className="size-10 aspect-square rounded-full object-cover md:size-12"
          src={avatar ? getPropertyImageUrl(avatar) : OWNER_AVATAR_FALLBACK}
          fallbackSrc={OWNER_AVATAR_FALLBACK}
        />
        {isOnline ? (
          <span
            role="status"
            aria-label={t("listing.online")}
            className="absolute -top-0.5 -start-0.5 size-3 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.9)]"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <p className="text-xs text-ink-subtle">
          {t("common.host")}
          {isOnline ? (
            <>
              {" - "}
              <span className="text-emerald-500">{t("listing.online")}</span>
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
