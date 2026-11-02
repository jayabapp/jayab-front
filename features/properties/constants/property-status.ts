export const PROPERTY_STATUS_KEYS = {
  1: "listing.statusAwaitingPayment",
  10: "listing.statusDraft",
  11: "listing.expiredListing",
  15: "listing.statusInProgress",
  20: "listing.statusAwaitingReview",
  25: "listing.statusRejected",
  30: "listing.statusPublished",
  31: "listing.statusUnderReReview",
  60: "listing.statusDeleted",
} as const;

export const propertyStatusKey = (id?: number | string | null) =>
  PROPERTY_STATUS_KEYS[Number(id) as keyof typeof PROPERTY_STATUS_KEYS];
