"use client";

import { emptyBedroomValues } from "@features/owner-property/mappers/property-draft.mapper";
import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyDraftForm } from "@features/owner-property/hooks/usePropertyDraftForm";
import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import { toBedroomValues } from "@features/owner-property/mappers/property-draft.mapper";

import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import TitledCounter from "./parts/TitledCounter";
import _STRINGS from "@/utils/LocalStrings";

const PropertyBedroomStep = ({ propertyId }: OwnerPropertyRouteProps) => {
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
      isPending={isPending}
      isLoading={isLoading}
      onSubmit={onSubmit}
      propertyId={propertyId}
      submitTitle={_STRINGS.SUBMIT_MOVE_ON}
    >
      <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
        {_STRINGS.ROOMS_INFO}
      </p>

      <div className="flex flex-col gap-2 border-b pb-4 w-full">
        <TitledCounter
          disableInput
          onChange={setRoomCount}
          title={_STRINGS.ROOM_COUNTS}
          value={values?.bedrooms?.length}
        />
        {values?.bedrooms?.map((beds, index) => (
          <TitledCounter
            disableInput
            value={beds}
            key={`bedroom${index + 1}`}
            onChange={(next) => setRoomBeds(next, index)}
            title={`${_STRINGS.BED_COUNT_OF_ROOM} ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 border-b pb-4 w-full">
        <TitledCounter
          disableInput
          title={_STRINGS.EXTRA_BED}
          value={values?.additional_bed}
          onChange={(next) => onChange(next, "additional_bed")}
        />
        <TitledCounter
          disableInput
          title={_STRINGS.MASTER_ROOM}
          value={values?.master_room}
          onChange={(next) => onChange(next, "master_room")}
        />
        <TitledCounter
          disableInput
          title={_STRINGS.SOFA_BED}
          value={values?.sofa_bed}
          onChange={(next) => onChange(next, "sofa_bed")}
        />
      </div>

      <div className="flex flex-col gap-2 border-b pb-4 w-full">
        <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
          {_STRINGS.REST_ROOMS}
        </p>
        <TitledCounter
          disableInput
          value={values?.wc}
          title={_STRINGS.WC_IR}
          onChange={(next) => onChange(next, "wc")}
        />
        <TitledCounter
          disableInput
          value={values?.wc_ir}
          title={_STRINGS.WC_INTERNATIONAL}
          onChange={(next) => onChange(next, "wc_ir")}
        />
      </div>

      <div className="flex flex-col gap-2 border-b pb-4 w-full">
        <p className="font-bold w-full text-start text-sm md:text-base text-brand-600">
          {_STRINGS.SHOWER}
        </p>
        <TitledCounter
          disableInput
          title={_STRINGS.BATHROOM_MASTER}
          value={values?.bathroom_master}
          onChange={(next) => onChange(next, "bathroom_master")}
        />
        <TitledCounter
          disableInput
          title={_STRINGS.ALL_SHOWER}
          value={values?.bathroom_general}
          onChange={(next) => onChange(next, "bathroom_general")}
        />
        <TitledCounter
          disableInput
          title={_STRINGS.SHOWE_IN_WC}
          value={values?.bathroom_in_wc}
          onChange={(next) => onChange(next, "bathroom_in_wc")}
        />
        <TitledCounter
          disableInput
          title={_STRINGS.TUB_SHOWER}
          value={values?.bathroom_tub}
          onChange={(next) => onChange(next, "bathroom_tub")}
        />
      </div>
    </PropertyStepFrame>
  );
};

export default PropertyBedroomStep;
