import { useLocalizeDigits } from "@hooks/useLocalizeDigits";
import { useTranslations } from "next-intl";
import { useFormatToman } from "@hooks/useFormatToman";
import { Icon } from "@elements/Icon";

import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";
import type { TExtraCost } from "@/types/components/modules/property-details";

const ExtraCosts = ({ property }: PropertySpecsSectionProps) => {
  const formatToman = useFormatToman();
  const digits = useLocalizeDigits();

  const t = useTranslations();

  const extraPerson = property?.daily_price?.additional_person ?? 0;
  const cleaning = property?.daily_price?.cleaning ?? 0;

  const costs: TExtraCost[] = [];
  if (extraPerson)
    costs.push({
      icon: "user-plus",
      amount: extraPerson,
      label: digits(
        `${t("listing.perNight")} • ${t("common.overStandardCapacity")} ${t("listing.people", { count: Number(property?.std_capacity) })}`,
      ),
    });
  if (cleaning)
    costs.push({
      icon: "broom",
      amount: cleaning,
      label: `${t("common.cleaningPrice")} • ${t("listing.oncePerStay")}`,
    });

  if (!costs.length) return <></>;
  return (
    <div className="flex flex-col rounded-20 border border-line-strong bg-surface p-4 md:p-5">
      <h3 className="text-base font-bold text-ink">
        {t("listing.extraCosts")}
      </h3>
      <ul className="flex list-none flex-col divide-y divide-line">
        {costs.map((cost) => (
          <li
            key={cost.icon}
            className="flex items-center justify-between gap-4 py-3 last:pb-0"
          >
            <span className="flex min-w-0 items-center gap-3 text-sm text-ink-muted">
              <Icon name={cost.icon} size={20} />
              {cost.label}
            </span>
            <span className="shrink-0 text-sm font-bold text-ink">
              {formatToman(cost.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExtraCosts;
