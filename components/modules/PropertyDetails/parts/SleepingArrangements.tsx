import { useTranslations } from "next-intl";

import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import MiniInfoCard from "./MiniInfoCard";
import FactRow from "./FactRow";

const SleepingArrangements = ({ property }: PropertySpecsSectionProps) => {
  const t = useTranslations();

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
    <div className="flex flex-col gap-4">
      {rooms.length || sharedBits.length ? (
        <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible">
          {rooms.map((beds, index) => (
            <MiniInfoCard
              icon="bed"
              className="min-w-[8.5rem] shrink-0"
              key={`bedroom-${index}`}
              title={`${t("listing.room")} ${index + 1}`}
              value={t("listing.bedsCount", { count: Number(beds) })}
              note={
                index === 0 && bedrooms?.master_room
                  ? t("common.masterRoom")
                  : null
              }
            />
          ))}

          {sharedBits.length ? (
            <MiniInfoCard
              icon="bed"
              className="min-w-[8.5rem] shrink-0"
              title={t("listing.sharedSpace")}
              value={sharedBits.join(" • ")}
            />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}

      {toilets.length || bathrooms ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {toilets.length ? (
            <FactRow icon="toilet" title={t("listing.wc")} summary={toilets} />
          ) : (
            <></>
          )}
          {bathrooms ? (
            <FactRow
              icon="bath"
              title={t("listing.bathroom")}
              summary={[
                `${t("listing.bathroomCount", { count: Number(bathrooms) })}`,
              ]}
            />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SleepingArrangements;
