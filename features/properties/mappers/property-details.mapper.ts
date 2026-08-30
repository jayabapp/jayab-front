import type { PropertyDetailsView } from "@/types/features/properties";
import type { SinglePropDto } from "@/api_services/property/property.interface";

export const toPropertyDetailsView = (
  property: SinglePropDto,
): PropertyDetailsView => ({
  advisorCommission: property?.advisor_commission,
  buildingArea: property?.building_area,
  city: property?.city,
  code: property?.code,
  favoriteCount: property?.favorite_count ?? 0,
  featureImage: property?.feature_image ?? null,
  hasBlueTick: !!property?.has_blue_tick,
  id: property?.id,
  images: property?.images ?? [],
  isAuthorized: !!property?.is_authorized,
  isChatEnabled: !!property?.is_chat_enabled,
  isPromoted: !!property?.is_promoted,
  maxCapacity: property?.max_capacity,
  ownerAvatar: property?.owner_info?.avatar ?? null,
  ownerName: property?.owner_info?.full_name ?? "",
  province: property?.province,
  region: property?.region,
  remainingDays: property?.remaining_days,
  slug: property?.slug,
  title: property?.title,
  todayPrice: {
    discountPercentage: property?.today_price?.discount_percentage,
    discountedPrice: property?.today_price?.discounted_price,
    price: property?.today_price?.price,
  },
  totalBedrooms: property?.total_bedrooms,
});
