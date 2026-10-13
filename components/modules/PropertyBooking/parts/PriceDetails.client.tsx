"use client";

import { useLocale, useTranslations } from "next-intl";
import { groupNightsByPrice } from "@features/reservations/lib/price-groups";
import { formatListingPriceFor } from "@/helpers/intl/number";
import { resolveLocale } from "@/i18n/config";
import { useState } from "react";
import { Icon } from "@elements/Icon";

import type { PriceDetailsProps } from "@/types/components/modules/property-booking";

const PriceDetails = ({ quote }: PriceDetailsProps) => {
  const locale = resolveLocale(useLocale());
  const unit = useTranslations("common")("toman");
  const formatToman = (value: number) =>
    `${formatListingPriceFor(value, locale)} ${unit}`;

  const t = useTranslations("reserve");

  const [open, setOpen] = useState(false);
  const groups = groupNightsByPrice(quote.nights_breakdown);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-fit cursor-pointer items-center gap-1 text-sm text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        {t("priceDetails")}
        <Icon
          size={16}
          name="chevron-down"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="flex flex-col gap-2 rounded-10 bg-surface-muted p-3">
          {groups.map((group) => (
            <div
              key={group.price}
              className="flex items-start justify-between gap-3 ui-body text-ink"
            >
              <span>
                {t("nightRateGroup", {
                  count: group.count,
                  nights: formatListingPriceFor(group.count, locale),
                  price: formatToman(group.price),
                })}
              </span>
              <span className="shrink-0 whitespace-nowrap tabular-nums">
                {formatToman(group.count * group.price)}
              </span>
            </div>
          ))}

          {quote.discount_total > 0 ? (
            <span className="w-fit rounded-full bg-status-danger-bg px-3 py-1 ui-caption text-status-danger">
              {t("discountLabel")} {formatToman(quote.discount_total)}
            </span>
          ) : null}

          <p className="ui-caption text-ink-subtle">{t("priceSetByHost")}</p>
        </div>
      ) : null}
    </div>
  );
};

export default PriceDetails;
