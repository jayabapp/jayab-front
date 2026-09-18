import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import formatToman from "@/helpers/formatToman";
import _STRINGS from "@/utils/LocalStrings";
import FactRow from "./FactRow";

const ExtraCosts = ({ property }: PropertySpecsSectionProps) => {
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
            _STRINGS.PER_NIGHT,
            `${_STRINGS.OVER_STANDARD_CAPACITY} ${property?.std_capacity} ${_STRINGS.NAFAR}`,
          ]}
        />
      ) : (
        <></>
      )}

      {cleaning ? (
        <FactRow
          icon="broom"
          title={formatToman(cleaning)}
          summary={[_STRINGS.CLEANING_PRiCE, _STRINGS.ONCE_PER_STAY]}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ExtraCosts;
