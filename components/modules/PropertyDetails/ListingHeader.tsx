import { useListSeparator } from "@hooks/useListSeparator";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { Icon } from "@elements/Icon";

import type { ListingHeaderProps } from "@/types/components/modules/property-details";

import SingleProductBreadCrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import ListingActions from "./parts/ListingActions.client";
import TrustBadges from "./parts/TrustBadges";

const ListingHeader = ({ breadcrumbs, property }: ListingHeaderProps) => {
  const t = useTranslations("listing");
  const sep = useListSeparator();

  const secondaryPlace = property?.region || property?.province;
  const secondaryLocale = property?.region
    ? property?.textLocales?.region
    : property?.textLocales?.province;

  return (
    <header className="enter-from-right order-2 flex flex-col gap-3 pt-4 md:order-1 md:pb-6 md:pt-0">
      <div className="flex min-w-0">
        <SingleProductBreadCrumb dataArray={breadcrumbs} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-start gap-2">
            {property?.hasBlueTick ? (
              <ContentImage
                width={20}
                height={20}
                alt={t("verified")}
                className="mt-1.5 size-5 shrink-0 md:mt-2.5"
                src="/assets/icons/adds/verified_badge.svg"
              />
            ) : (
              <></>
            )}
            <h1
              lang={property?.textLocales?.title ?? "fa"}
              dir="auto"
              // !leading: the global h1 rule in globals.css pins line-height with !important.
              className="text-balance text-xl font-bold text-ink md:text-3xl md:!leading-10"
            >
              {property?.title}
            </h1>
          </div>

          <span className="flex items-center gap-1.5 text-sm text-ink-muted">
            <Icon name="map-pin" size={16} />
            <span>
              <bdi lang={property?.textLocales?.city ?? "fa"}>
                {property?.city}
              </bdi>
              {property?.city && secondaryPlace ? sep : ""}
              <bdi lang={secondaryLocale ?? "fa"}>{secondaryPlace}</bdi>
            </span>
          </span>

          <TrustBadges property={property} />
        </div>

        <div className="shrink-0 overflow-x-auto">
          <ListingActions
            code={property?.code}
            propertyId={property?.id}
            favoriteCount={property?.favoriteCount}
            slug={property?.slug || `${property?.code}-s`}
          />
        </div>
      </div>
    </header>
  );
};

export default ListingHeader;
