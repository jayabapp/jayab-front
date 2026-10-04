import { ContentImage } from "@elements/Image";
import { Icon } from "@elements/Icon";

import type { ListingHeaderProps } from "@/types/components/modules/property-details";

import SingleProductBreadCrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import ListingActions from "./parts/ListingActions.client";
import TrustBadges from "./parts/TrustBadges";
import _STRINGS from "@/utils/LocalStrings";

const ListingHeader = ({ breadcrumbs, property }: ListingHeaderProps) => {
  const place = [property?.city, property?.region || property?.province]
    .filter(Boolean)
    .join("، ");

  return (
    <header className="enter-from-right order-3 flex flex-col gap-3 pb-4 pt-2 md:order-2 md:pb-6">
      <div className="hidden md:flex">
        <SingleProductBreadCrumb dataArray={breadcrumbs} />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-start gap-2">
            {property?.hasBlueTick ? (
              <ContentImage
                width={20}
                height={20}
                alt={_STRINGS.VERIFIED}
                className="mt-1 size-5 shrink-0"
                src="/assets/icons/adds/verified_badge.svg"
              />
            ) : (
              <></>
            )}
            <h1 className="text-balance text-xl font-bold leading-8 text-neutral-900 md:text-2xl md:leading-9">
              {property?.title}
            </h1>
          </div>

          <span className="flex items-center gap-1 text-sm text-neutral-500">
            <Icon name="map-pin" size={16} />
            {place}
          </span>
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

      <TrustBadges property={property} />
    </header>
  );
};

export default ListingHeader;
