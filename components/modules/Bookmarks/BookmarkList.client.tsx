"use client";

import { PropertyCard, PropertyCardSkeleton } from "@modules/PropertyGrid";
import { useUserBookmarks } from "@features/user/hooks/useUserBookmarks";

import EmptyState from "@elements/EmptyState";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

const SKELETON_COUNT = 4;

const BookmarkList = () => {
  const { data: properties, isLoading } = useUserBookmarks();

  if (isLoading)
    return (
      <div className="grid w-full grid-cols-1 gap-4 p-2 md:grid-cols-2">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );

  if (isEmpty(properties)) return <EmptyState
        actionRoute="/rooms"
        title={_STRINGS.EMPTY_BOOKMARKS_TITLE}
        description={_STRINGS.EMPTY_BOOKMARKS_DESC}
        actionLabel={_STRINGS.SEARCH_PROPERTY_CTA}
      />;

  return (
    <div className="w-full p-2 !grid gap-4 grid-cols-1 md:grid-cols-2">
      {properties?.map((property) => (
        <PropertyCard data={property} key={`propertyCard${property?.id}`} />
      ))}
    </div>
  );
};

export default BookmarkList;
