import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import ClampText from "./ClampText.client";
import type { TSurrounding } from "@/types/components/modules/property-details";

const SurroundingFact = ({
  icon,
  label,
  value,
}: TSurrounding) => (
  <div className="flex items-start gap-3">
    <Icon name={icon} size={20} className="mt-0.5 shrink-0 text-neutral-500" />
    <p className="text-sm text-neutral-800 md:text-base">
      <span className="font-bold text-neutral-900">{label}:</span>{" "}
      <span className="font-normal">{value}</span>
    </p>
  </div>
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options?.pattern ? (
          <SurroundingFact
            icon="home"
            label={t("common.envPattern")}
            value={options.pattern}
          />
        ) : (
          <></>
        )}
        {options?.access ? (
          <SurroundingFact
            icon="map-pin"
            label={t("common.accessRoute")}
            value={options.access}
          />
        ) : (
          <></>
        )}
        {options?.neighborhood ? (
          <SurroundingFact
            icon="users"
            label={t("listing.propNeightbour")}
            value={options.neighborhood}
          />
        ) : (
          <></>
        )}
      </div>

      {descriptions?.pattern_dscr ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-neutral-900">
            {t("listing.accsessRouteDesc")}
          </p>
          <ClampText lines={3}>{descriptions.pattern_dscr}</ClampText>
        </div>
      ) : (
        <></>
      )}

      {descriptions?.distance_dscr ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-neutral-900">
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
