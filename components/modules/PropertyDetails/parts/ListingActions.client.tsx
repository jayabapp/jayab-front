"use client";

import { useLocalizeDigits } from "@hooks/useLocalizeDigits";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { ListingActionsProps } from "@/types/components/modules/property-details";

import PropertyBookmarkButton from "./PropertyBookmarkButton.client";
import PropertyLikeButton from "./PropertyLikeButton.client";
import ShareLink from "@elements/Share/BrowserShare.client";
import Notify from "@elements/Toast";

const SHELL_CLASS =
  "flex h-11 shrink-0 items-center rounded-full border border-line-strong bg-surface text-sm text-ink transition-colors hover:bg-surface-muted";

const ACTION_CLASS = `${SHELL_CLASS} cursor-pointer justify-center gap-1.5 px-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus`;

const ListingActions = ({
  code,
  slug,
  propertyId,
  favoriteCount,
}: ListingActionsProps) => {
  const t = useTranslations();
  const digits = useLocalizeDigits();

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
        <span className="font-semibold">{digits(code)}</span>
      </button>

      <div className={SHELL_CLASS}>
        <ShareLink
          passedHref={`${origin}/rooms/${slug}`}
          containerClass="h-11 flex-row relative justify-center px-3.5"
        />
      </div>

      <PropertyBookmarkButton
        propertyId={propertyId}
        className={ACTION_CLASS}
      />

      <PropertyLikeButton
        propertyId={propertyId}
        className={ACTION_CLASS}
        onCountChange={(delta) =>
          setFavourites((count) => Math.max(0, count + delta))
        }
      >
        <span className="text-xs text-ink-muted">{digits(favourites)}</span>
      </PropertyLikeButton>
    </div>
  );
};

export default ListingActions;
