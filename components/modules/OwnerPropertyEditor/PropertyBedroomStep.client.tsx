"use client";

import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyDraftForm } from "@features/owner-property/hooks/usePropertyDraftForm";
import { emptyBedroomValues } from "@features/owner-property/mappers/property-draft.mapper";
import { toBedroomValues } from "@features/owner-property/mappers/property-draft.mapper";
import { useTranslations } from "next-intl";

import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";

import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import TitledCounter from "./parts/TitledCounter";

const PropertyBedroomStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const t = useTranslations();

  const { draft, isLoading, onChange, values } = usePropertyDraftForm(
    propertyId,
    emptyBedroomValues,
    { map: toBedroomValues },
  );
  const { isPending, submit } = useOwnerPropertyStep("bedroom", propertyId);

  const onSubmit = () => {
    if (!draft?.id) return;
    submit({ ...values, propertyId: draft?.id });
  };

  const setRoomCount = (count: number) =>
    onChange(
      count > values.bedrooms.length
        ? [...values.bedrooms, 0]
        : values.bedrooms.filter(
            (_room, index) => index !== values.bedrooms.length - 1,
          ),
      "bedrooms",
    );

  const setRoomBeds = (beds: number, roomIndex: number) =>
    onChange(
      values.bedrooms.map((room, index) => (index === roomIndex ? beds : room)),
      "bedrooms",
    );

  return (
    <PropertyStepFrame
      step="bedroom"
      onSubmit={onSubmit}
      isPending={isPending}
      isLoading={isLoading}
      propertyId={propertyId}
      submitTitle={t("owner.submitMoveOn")}
    >
      <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
        {t("owner.roomsInfo")}
      </p>

      <div className="flex flex-col gap-2 border-b pb-4 w-full">
        <TitledCounter
          disableInput
          onChange={setRoomCount}
          title={t("owner.roomCounts")}
          value={values?.bedrooms?.length}
        />
        {values?.bedrooms?.map((beds, index) => (
          <TitledCounter
            disableInput
            value={beds}
            key={`bedroom${index + 1}`}
            onChange={(next) => setRoomBeds(next, index)}
            title={`${t("owner.bedCountOfRoom")} ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 border-b pb-4 w-full">
        <TitledCounter
          disableInput
          title={t("owner.extraBed")}
          value={values?.additional_bed}
          onChange={(next) => onChange(next, "additional_bed")}
        />
        <TitledCounter
          disableInput
          title={t("common.masterRoom")}
          value={values?.master_room}
          onChange={(next) => onChange(next, "master_room")}
        />
        <TitledCounter
          disableInput
          title={t("common.sofaBed")}
          value={values?.sofa_bed}
          onChange={(next) => onChange(next, "sofa_bed")}
        />
      </div>

      <div className="flex flex-col gap-2 border-b pb-4 w-full">
        <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
          {t("owner.restRooms")}
        </p>
        <TitledCounter
          disableInput
          value={values?.wc}
          title={t("common.wcIr")}
          onChange={(next) => onChange(next, "wc")}
        />
        <TitledCounter
          disableInput
          value={values?.wc_ir}
          title={t("common.wcInternational")}
          onChange={(next) => onChange(next, "wc_ir")}
        />
      </div>

      <div className="flex flex-col gap-2 border-b pb-4 w-full">
        <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
          {t("owner.shower")}
        </p>
        <TitledCounter
          disableInput
          title={t("owner.bathroomMaster")}
          value={values?.bathroom_master}
          onChange={(next) => onChange(next, "bathroom_master")}
        />
        <TitledCounter
          disableInput
          title={t("owner.allShower")}
          value={values?.bathroom_general}
          onChange={(next) => onChange(next, "bathroom_general")}
        />
        <TitledCounter
          disableInput
          title={t("owner.showeInWc")}
          value={values?.bathroom_in_wc}
          onChange={(next) => onChange(next, "bathroom_in_wc")}
        />
        <TitledCounter
          disableInput
          title={t("owner.tubShower")}
          value={values?.bathroom_tub}
          onChange={(next) => onChange(next, "bathroom_tub")}
        />
      </div>
    </PropertyStepFrame>
  );
};

export default PropertyBedroomStep;
