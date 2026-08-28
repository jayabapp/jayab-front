/**
 * ADR 0001: legacy route-level client boundaries.
 *
 * Context: these routes predate the server-first policy and currently own local
 * state, effects, mutations, or browser-only integrations at page/layout level.
 *
 * Rejected alternative: converting every route in the architecture-foundation
 * change would mix behavioral rewrites across auth, owner, reservation, support,
 * and notification domains and make safe rollback impossible.
 *
 * Bundle impact: the complete route subtree is hydrated until its vertical slice
 * is migrated. New entries are forbidden; removing an entry is always allowed.
 *
 * Containment plan: migrate entries feature-by-feature according to
 * docs/component-architecture/03-project-migration-map.md, moving interaction to
 * colocated `.client.tsx` islands and deleting the corresponding exception.
 */
export const legacyClientRoutes = [
  "app/(profile)/layout.tsx",
  "app/(profile)/profile/(advisor)/advisor/subscription/[subscription_key]/page.tsx",
  "app/(profile)/profile/(advisor)/advisor/subscription/page.tsx",
  "app/(profile)/profile/(owner)/owner/photo-upgrade-requests/[id]/page.tsx",
  "app/(profile)/profile/(owner)/owner/photo-upgrade-requests/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/edit/assistants/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/edit/bedroom/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/edit/environment/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/edit/facility/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/edit/initials/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/edit/location/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/edit/media/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/edit/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/edit/price/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/edit/terms/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/inquery/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/license/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/[property_id]/subscription/page.tsx",
  "app/(profile)/profile/(owner)/owner/properties/page.tsx",
  "app/(profile)/profile/bookmarks/page.tsx",
  "app/(profile)/profile/edit/page.tsx",
  "app/(profile)/profile/invite/page.tsx",
  "app/(profile)/profile/my-payments/page.tsx",
  "app/(profile)/profile/page.tsx",
  "app/(profile)/profile/reserves/page.tsx",
  "app/(profile)/profile/support/[id]/page.tsx",
  "app/(profile)/profile/support/page.tsx",
  "app/notifications/page.tsx",
  "app/route-hub/page.tsx",
];
