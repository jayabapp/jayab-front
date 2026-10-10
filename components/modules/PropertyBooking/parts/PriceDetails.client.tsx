"use client";

import { useTranslations } from "next-intl";
import { useFormatToman } from "@hooks/useFormatToman";
import { useState } from "react";
import { Icon } from "@elements/Icon";

import type { PriceDetailsProps } from "@/types/components/modules/property-booking";

const groupNights = (nights: PriceDetailsProps["quote"]["nights_breakdown"]) =>
  nights.reduce<{ count: number; price: number }[]>((groups, night) => {
    const last = groups[groups.length - 1];
    if (last && last.price === night.final_price) last.count += 1;
    else groups.push({ count: 1, price: night.final_price });
    return groups;
  }, []);

const PriceDetails = ({ quote }: PriceDetailsProps) => {
  const formatToman = useFormatToman();

  const t = useTranslations("reserve");

  const [open, setOpen] = useState(false);
  const groups = groupNights(quote.nights_breakdown);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-fit cursor-pointer items-center gap-1 text-sm text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {t("priceDetails")}
        <Icon
          size={16}
          name="chevron-down"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="flex flex-col gap-2 rounded-10 bg-neutral-50 p-3">
          {groups.map((group, index) => (
            <div
              key={`${index}-${group.price}`}
              className="flex items-center justify-between gap-3 text-sm text-neutral-800"
            >
              <span>
                {t("nights", { count: Number(group.count) })} ×{" "}
                {formatToman(group.price)}
              </span>
              <span>{formatToman(group.count * group.price)}</span>
            </div>
          ))}

          {quote.discount_total > 0 ? (
            <span className="w-fit rounded-full bg-danger-50 px-3 py-1 text-xs text-danger-500">
              {t("discountLabel")} {formatToman(quote.discount_total)}
            </span>
          ) : null}

          <p className="text-xs text-neutral-500">{t("priceSetByHost")}</p>
        </div>
      ) : null}
    </div>
  );
};

export default PriceDetails;
