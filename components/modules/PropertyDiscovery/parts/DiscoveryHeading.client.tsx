"use client";

import { useFormatNumber } from "@hooks/useFormatNumber";
import { useTranslations } from "next-intl";
import { useProperties } from "@features/properties/hooks/useProperties";

import type { DiscoveryHeadingProps } from "@/types/components/modules/property-discovery";

const DiscoveryHeading = ({ title, query }: DiscoveryHeadingProps) => {
  const t = useTranslations("listing");
  const formatNumber = useFormatNumber();
  const { meta } = useProperties(query);

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3 xl:px-0">
      <h1 className="text-xl font-bold text-ink md:text-2xl">{title}</h1>
      {typeof meta?.total === "number" ? (
        <p className="text-sm text-ink-subtle">
          {t("propertyCount", { formatted: formatNumber(meta.total) })}
        </p>
      ) : null}
    </div>
  );
};

export default DiscoveryHeading;
