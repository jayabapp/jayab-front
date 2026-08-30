import type { PropertyDraftStep } from "@/types/features/owner-property";

export const ownerPropertyRoute = (propertyId: string | number) =>
  `/profile/owner/properties/${propertyId}`;

export const ownerPropertyEditRoute = (propertyId: string | number) =>
  `${ownerPropertyRoute(propertyId)}/edit`;

export const ownerPropertyStepRoute = (
  propertyId: string | number,
  step: PropertyDraftStep,
) => `${ownerPropertyEditRoute(propertyId)}/${step}`;

const nextStep: Partial<Record<PropertyDraftStep, PropertyDraftStep>> = {
  assistants: "terms",
  bedroom: "facility",
  environment: "bedroom",
  facility: "price",
  initials: "location",
  location: "media",
  media: "environment",
  price: "assistants",
};

export const nextPropertyStep = (step: PropertyDraftStep) => nextStep[step];

export const propertyStepIndex: Record<PropertyDraftStep, number> = {
  initials: 1,
  location: 2,
  media: 3,
  environment: 4,
  bedroom: 5,
  facility: 6,
  price: 7,
  assistants: 8,
  terms: 9,
};
