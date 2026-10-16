import { useLocalizeDigits } from "@hooks/useLocalizeDigits";
import { useTranslations } from "next-intl";

import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import CancellationSummary from "./CancellationSummary.client";
import MiniInfoCard from "./MiniInfoCard";
import formatHour from "@/helpers/formatHour";
import ClampText from "./ClampText.client";
import RuleItem from "./RuleItem";
import {
  canonicalRuleTitle,
  isRuleAllowed,
} from "@features/properties/mappers/property-details.mapper";

const HouseRules = ({ property }: PropertySpecsSectionProps) => {
  const t = useTranslations();
  const digits = useLocalizeDigits();

  const descriptions = property?.property_descriptions;
  const options = property?.options;
  const guestTypes = options?.guest_type ?? [];
  const locales = property?.description_locales;
  const guestLang = (title: string) =>
    property?.option_items?.find(
      (item) => item.group === "guest_type" && item.title === title,
    )?.title_locale;

  return (
    <div className="flex flex-col gap-5">
      {/* Same four-column grid as the sleeping cards, so both card rows line up. */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniInfoCard
          icon="clock"
          value={t("common.enterHour")}
          title={digits(formatHour(property?.check_in_hour))}
        />
        <MiniInfoCard
          icon="clock"
          value={t("common.endHour")}
          title={digits(formatHour(property?.check_out_hour))}
        />
        {property?.canceling_type?.title ? (
          <div className="col-span-2 flex items-center rounded-10 border border-line-strong bg-surface p-4">
            <CancellationSummary cancelingType={property.canceling_type} />
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {guestTypes.map((type) => (
          <RuleItem
            allowed
            label={type}
            labelLang={guestLang(type)}
            key={`guest-type-${type}`}
          />
        ))}

        {options?.pet ? (
          <RuleItem
            descriptionLang={locales?.pet_dscr}
            allowed={isRuleAllowed(canonicalRuleTitle(property, "pet"))}
            description={descriptions?.pet_dscr}
            label={`${t("common.animalRules")}: ${options.pet}`}
          />
        ) : (
          <></>
        )}

        {options?.party ? (
          <RuleItem
            descriptionLang={locales?.party_dscr}
            allowed={isRuleAllowed(canonicalRuleTitle(property, "party"))}
            description={descriptions?.party_dscr}
            label={`${t("common.partyRules")}: ${options.party}`}
          />
        ) : (
          <></>
        )}
      </div>

      {descriptions?.doc_dscr ? (
        <div className="flex flex-col gap-1">
          <p className="ui-body font-semibold text-ink">
            {t("common.requiredDocs")}
          </p>
          <ClampText lines={3} lang={locales?.doc_dscr}>
            {descriptions.doc_dscr}
          </ClampText>
        </div>
      ) : (
        <></>
      )}

      {descriptions?.other_dscr ? (
        <div className="flex flex-col gap-1">
          <p className="ui-body font-semibold text-ink">
            {t("listing.otherTerms")}
          </p>
          <ClampText lines={3} lang={locales?.other_dscr}>
            {descriptions.other_dscr}
          </ClampText>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default HouseRules;
