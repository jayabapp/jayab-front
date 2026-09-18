import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import CancellationSummary from "./CancellationSummary.client";
import formatHour from "@/helpers/formatHour";
import _STRINGS from "@/utils/LocalStrings";
import ClampText from "./ClampText.client";
import MiniInfoCard from "./MiniInfoCard";
import RuleItem from "./RuleItem";

const isAllowed = (value?: string | null) =>
  Boolean(value) && !`${value}`.includes("نیست");

const HouseRules = ({ property }: PropertySpecsSectionProps) => {
  const descriptions = property?.property_descriptions;
  const options = property?.options;
  const guestTypes = options?.guest_type ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <MiniInfoCard
          icon="clock"
          title={_STRINGS.ENTER_HOUR}
          value={formatHour(property?.check_in_hour)}
        />
        <MiniInfoCard
          icon="clock"
          title={_STRINGS.END_HOUR}
          value={formatHour(property?.check_out_hour)}
        />
      </div>

      <CancellationSummary cancelingType={property?.canceling_type} />

      <div className="flex flex-col gap-3">
        {guestTypes.map((type) => (
          <RuleItem allowed key={`guest-type-${type}`} label={type} />
        ))}

        {options?.pet ? (
          <RuleItem
            allowed={isAllowed(options.pet)}
            description={descriptions?.pet_dscr}
            label={`${_STRINGS.ANIMAL_RULES}: ${options.pet}`}
          />
        ) : (
          <></>
        )}

        {options?.party ? (
          <RuleItem
            allowed={isAllowed(options.party)}
            description={descriptions?.party_dscr}
            label={`${_STRINGS.PARTY_RULES}: ${options.party}`}
          />
        ) : (
          <></>
        )}
      </div>

      {descriptions?.doc_dscr ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-neutral-900">
            {_STRINGS.REQUIRED_DOCS}
          </p>
          <ClampText lines={3}>{descriptions.doc_dscr}</ClampText>
        </div>
      ) : (
        <></>
      )}

      {descriptions?.other_dscr ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-neutral-900">
            {_STRINGS.OTHER_TERMS}
          </p>
          <ClampText lines={3}>{descriptions.other_dscr}</ClampText>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default HouseRules;
