import type { ListingHeaderProps } from "@/types/components/modules/property-details";
import { ContentImage } from "@elements/Image";
import { Icon } from "@elements/Icon";

import SingleProductBreadCrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import ListingActions from "./parts/ListingActions.client";
import _STRINGS from "@/utils/LocalStrings";

const ListingHeader = ({ breadcrumbs, property }: ListingHeaderProps) => {
  const place = [property?.city, property?.region || property?.province]
    .filter(Boolean)
    .join("، ");

  return (
    <header className="flex flex-col gap-3 pb-4 pt-2 md:pb-6">
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

          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <Icon name="map-pin" size={16} />
              {place}
            </span>
            {property?.isAuthorized ? (
              <span className="flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-xs font-semibold text-success-600">
                <Icon name="shield" size={16} />
                {_STRINGS.VERIFIED}
              </span>
            ) : (
              <></>
            )}
            {property?.isPromoted ? (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                {_STRINGS.LADDERED}
              </span>
            ) : (
              <></>
            )}
          </div>
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
