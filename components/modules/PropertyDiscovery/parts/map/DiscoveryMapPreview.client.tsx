"use client";

import { usePropertyMapPreview } from "@features/properties/hooks/usePropertyMapPreview";
import { useTranslations } from "next-intl";
import { PropertyCard } from "@modules/PropertyGrid";
import { Icon } from "@elements/Icon";

import type { DiscoveryMapPreviewProps } from "@/types/components/modules/discovery-map";

const DiscoveryMapPreview = ({
  id,
  onClose,
  properties,
  searchParams,
}: DiscoveryMapPreviewProps) => {
  const t = useTranslations("listing");
  const tCommon = useTranslations("common");
  const { property, isPending, isError, retry } = usePropertyMapPreview(
    id,
    properties,
  );
  const isApproximate = property?.public_location?.precision === "approximate";

  return (
    <div
      role="group"
      aria-busy={isPending}
      aria-label={property?.title}
      className="relative w-full max-w-sm rounded-20 bg-surface shadow-elevated"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("mapPreviewClose")}
        className="absolute -end-2 -top-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-surface text-ink shadow-elevated transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <Icon name="x" size={16} />
      </button>

      {isPending ? (
        <div
          aria-hidden="true"
          className="h-32 w-full animate-pulse rounded-20 bg-surface-muted"
        />
      ) : null}

      {isError ? (
        <div
          role="alert"
          className="flex flex-col items-start gap-2 p-4 text-sm"
        >
          <p className="text-ink">{t("mapPreviewError")}</p>
          <button
            type="button"
            onClick={retry}
            className="cursor-pointer font-bold text-link underline underline-offset-4"
          >
            {tCommon("tryAgain")}
          </button>
        </div>
      ) : null}

      {property ? (
        <>
          <PropertyCard data={property} searchParams={searchParams} />
          {isApproximate ? (
            <p className="flex items-center gap-1.5 px-4 pb-3 text-xs text-ink-subtle">
              <Icon name="map-pin" size={16} />
              {t("mapApproximate")}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default DiscoveryMapPreview;
