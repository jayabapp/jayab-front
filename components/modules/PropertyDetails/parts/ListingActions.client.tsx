"use client";

import type { ListingActionsProps } from "@/types/components/modules/property-details";
import { useState } from "react";

import PropertyBookmarkButton from "./PropertyBookmarkButton.client";
import PropertyLikeButton from "./PropertyLikeButton.client";
import ShareLink from "@elements/Share/BrowserShare.client";
import _STRINGS from "@/utils/LocalStrings";
import Notify from "@elements/Toast";

const ACTION_CLASS =
  "flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-800 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

const ListingActions = ({
  code,
  slug,
  propertyId,
  favoriteCount,
}: ListingActionsProps) => {
  const [favourites, setFavourites] = useState(favoriteCount || 0);
  const [origin] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin,
  );

  const copyCode = async () => {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(code);
    Notify({ type: "success", body: _STRINGS.CODE_COPIED });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={copyCode}
        className={ACTION_CLASS}
        aria-label={_STRINGS.COPY_CODE}
      >
        <span className="text-neutral-500">{_STRINGS.CODE}</span>
        <span className="font-semibold">{code}</span>
      </button>

      <div className={ACTION_CLASS}>
        <ShareLink passedHref={`${origin}/rooms/${slug}`} />
      </div>

      <div className={ACTION_CLASS}>
        <PropertyBookmarkButton propertyId={propertyId} />
      </div>

      <div className={ACTION_CLASS}>
        <PropertyLikeButton
          propertyId={propertyId}
          onCountChange={(delta) =>
            setFavourites((count) => Math.max(0, count + delta))
          }
        />
        <span className="text-xs text-neutral-600">{favourites}</span>
      </div>
    </div>
  );
};

export default ListingActions;
