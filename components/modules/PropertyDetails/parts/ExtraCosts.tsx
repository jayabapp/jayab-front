
import { useTranslations } from "next-intl";
import { useFormatToman } from "@hooks/useFormatToman";

import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import FactRow from "./FactRow";

const ExtraCosts = ({ property }: PropertySpecsSectionProps) => {
  const formatToman = useFormatToman();

  const t = useTranslations();

  const extraPerson = property?.daily_price?.additional_person ?? 0;
  const cleaning = property?.daily_price?.cleaning ?? 0;
  if (!extraPerson && !cleaning) return <></>;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {extraPerson ? (
        <FactRow
          icon="user-plus"
          title={formatToman(extraPerson)}
          summary={[
            t("listing.perNight"),
            `${t("common.overStandardCapacity")} ${t("listing.people", { count: Number(property?.std_capacity) })}`,
          ]}
        />
      ) : (
        <></>
      )}

      {cleaning ? (
        <FactRow
          icon="broom"
          title={formatToman(cleaning)}
          summary={[t("common.cleaningPrice"), t("listing.oncePerStay")]}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ExtraCosts;
