import { useLocalizeDigits } from "@hooks/useLocalizeDigits";
import { useTranslations } from "next-intl";

import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import MiniInfoCard from "./MiniInfoCard";

const SleepingArrangements = ({ property }: PropertySpecsSectionProps) => {
  const t = useTranslations();
  const digits = useLocalizeDigits();

  const bedrooms = property?.bedrooms;
  const rooms = bedrooms?.bedrooms ?? [];

  const sharedBits = [
    bedrooms?.additional_bed
      ? `${bedrooms.additional_bed} ${t("listing.extraBedding")}`
      : null,
    bedrooms?.sofa_bed ? t("common.sofaBed") : null,
  ].filter(Boolean);

  const toilets = [
    bedrooms?.wc ? `${bedrooms.wc} ${t("common.wcIr")}` : null,
    bedrooms?.wc_ir ? `${bedrooms.wc_ir} ${t("common.wcInternational")}` : null,
  ].filter(Boolean);

  const bathrooms =
    (bedrooms?.bathroom_general ?? 0) +
    (bedrooms?.bathroom_tub ?? 0) +
    (bedrooms?.bathroom_in_wc ?? 0) +
    (bedrooms?.bathroom_master ?? 0);

  if (!rooms.length && !sharedBits.length && !toilets.length && !bathrooms)
    return <></>;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {rooms.map((beds, index) => (
        <MiniInfoCard
          icon="bed"
          key={`bedroom-${index}`}
          title={digits(`${t("listing.room")} ${index + 1}`)}
          value={digits(t("listing.bedsCount", { count: Number(beds) }))}
          note={
            index === 0 && bedrooms?.master_room ? t("common.masterRoom") : null
          }
        />
      ))}

      {sharedBits.length ? (
        <MiniInfoCard
          icon="bed"
          title={t("listing.sharedSpace")}
          value={digits(sharedBits.join(" • "))}
        />
      ) : (
        <></>
      )}

      {toilets.length ? (
        <MiniInfoCard
          icon="toilet"
          title={t("listing.wc")}
          value={digits(toilets.join(" • "))}
        />
      ) : (
        <></>
      )}

      {bathrooms ? (
        <MiniInfoCard
          icon="bath"
          title={t("listing.bathroom")}
          value={digits(
            t("listing.bathroomCount", { count: Number(bathrooms) }),
          )}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default SleepingArrangements;
