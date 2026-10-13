import { useTranslations } from "next-intl";

import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";
import type { TSurrounding } from "@/types/components/modules/property-details";

import ClampText from "./ClampText.client";

const SurroundingFact = ({ label, value }: TSurrounding) => (
  <p className="flex min-w-0 flex-col gap-0.5">
    <span className="text-xs text-ink-subtle">{label}</span>
    <span className="text-sm font-semibold text-ink">{value}</span>
  </p>
);

const Surroundings = ({ property }: PropertySpecsSectionProps) => {
  const t = useTranslations();

  const descriptions = property?.property_descriptions;
  const options = property?.options;

  const hasFacts = options?.pattern || options?.access || options?.neighborhood;
  if (!hasFacts && !descriptions?.pattern_dscr && !descriptions?.distance_dscr)
    return <></>;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {options?.pattern ? (
          <SurroundingFact
            label={t("common.envPattern")}
            value={options.pattern}
          />
        ) : (
          <></>
        )}
        {options?.access ? (
          <SurroundingFact
            value={options.access}
            label={t("common.accessRoute")}
          />
        ) : (
          <></>
        )}
        {options?.neighborhood ? (
          <SurroundingFact
            value={options.neighborhood}
            label={t("listing.propNeightbour")}
          />
        ) : (
          <></>
        )}
      </div>

      {descriptions?.pattern_dscr ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-ink">
            {t("listing.accsessRouteDesc")}
          </p>
          <ClampText lines={3}>{descriptions.pattern_dscr}</ClampText>
        </div>
      ) : (
        <></>
      )}

      {descriptions?.distance_dscr ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-ink">
            {t("common.distancetoPoint")}
          </p>
          <ClampText lines={3}>{descriptions.distance_dscr}</ClampText>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Surroundings;
