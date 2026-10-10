"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import type { ListingActionsProps } from "@/types/components/modules/property-details";

import PropertyBookmarkButton from "./PropertyBookmarkButton.client";
import PropertyLikeButton from "./PropertyLikeButton.client";
import ShareLink from "@elements/Share/BrowserShare.client";
import Notify from "@elements/Toast";

const ACTION_CLASS =
  "flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm text-ink transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";

const ListingActions = ({
  code,
  slug,
  propertyId,
  favoriteCount,
}: ListingActionsProps) => {
  const t = useTranslations();

  const [favourites, setFavourites] = useState(favoriteCount || 0);
  const [origin] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin,
  );

  const copyCode = async () => {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(code);
    Notify({ type: "success", body: t("listing.codeCopied") });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={copyCode}
        className={ACTION_CLASS}
        aria-label={t("listing.copyCode")}
      >
        <span className="text-ink-subtle">{t("common.code")}</span>
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
        <span className="text-xs text-ink-muted">{favourites}</span>
      </div>
    </div>
  );
};

export default ListingActions;
