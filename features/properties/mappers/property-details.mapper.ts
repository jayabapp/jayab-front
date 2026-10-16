import type { PropertyDetailsView } from "@/types/features/properties";
import type { SinglePropDto } from "@/api_services/property/property.interface";

// Rules are decided from the Persian title, which is the same in every language.
export const isRuleAllowed = (value?: string | number | null) =>
  Boolean(value) && !`${value}`.includes("نیست");

export const canonicalRuleTitle = (
  property: SinglePropDto | undefined,
  group: "pet" | "party",
) =>
  property?.option_items?.find((item) => item.group === group)
    ?.canonical_title ?? property?.options?.[group];

export const toPropertyDetailsView = (
  property: SinglePropDto,
): PropertyDetailsView => ({
  textLocales: property?.text_locales,
  advisorCommission: property?.advisor_commission,
  buildingArea: property?.building_area,
  city: property?.city,
  cleaningFee: property?.daily_price?.cleaning ?? 0,
  code: property?.code,
  extraGuestFee: property?.daily_price?.additional_person ?? 0,
  favoriteCount: property?.favorite_count ?? 0,
  featureImage: property?.feature_image ?? null,
  hasBlueTick: !!property?.has_blue_tick,
  hasActiveSubscription: !!property?.has_active_subscription,
  hasPool: !!property?.has_pool,
  id: property?.id,
  images: property?.images ?? [],
  isAuthorized: !!property?.is_authorized,
  isChatEnabled: !!property?.is_chat_enabled,
  isPromoted: !!property?.is_promoted,
  isPetAllowed: isRuleAllowed(canonicalRuleTitle(property, "pet")),
  isEventsAllowed: isRuleAllowed(canonicalRuleTitle(property, "party")),
  maxCapacity: property?.max_capacity,
  ownerAvatar: property?.owner_info?.avatar ?? null,
  ownerName: property?.owner_info?.full_name ?? "",
  ownerNameLocale: property?.owner_info?.full_name_locale,
  ownerSince: property?.owner_info?.since ?? null,
  seoLinks: property?.seo_links,
  province: property?.province,
  region: property?.region,
  remainingDays: property?.remaining_days,
  slug: property?.slug,
  stdCapacity: property?.std_capacity ?? 0,
  title: property?.title,
  todayPrice: {
    discountPercentage: property?.today_price?.discount_percentage,
    discountedPrice: property?.today_price?.discounted_price,
    price: property?.today_price?.price,
  },
  minimumPrice: property?.minimum_price ?? null,
  totalBedrooms: property?.total_bedrooms,
});
