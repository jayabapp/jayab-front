import { YupValidator } from "@/utils/YupValidator";
import { apiRoutes } from "@/utils/urls";
import { ImageDto } from "../auth/auth.interface";
import { apiCall } from "../common/apicall.helper";
import { p2e } from "@/helpers/NumberConverter";
import {
  AssistantSendDto,
  CreatePropertyStepOneDto,
  FacilitiesValuesDto,
  GetPropBadgeDto,
  GetPropertiesPlusFilters,
  JalaaliDayDto,
  OwnerCallendarItemDto,
  OwnerPropsRangeDto,
  OwnerSinglePropertyAuthdata,
  PageMetaDto,
  PayPropertySubSendDto,
  PricingPropertySendDto,
  PropertyContactIInfDto,
  PropertyListDto,
  PropertyOptionGroup,
  PropertyStatsDto,
  PropertySubsDto,
  PropertyTermsSendDto,
  PropInitDto,
  ProvienceTypesDto,
  RoomInfosDto,
  SingleOwnerPropertyDto,
  SinglePropDto,
} from "./property.interface";

export class PropertyService {
  static USER_PROP_OPTIONS_CACHEKEY = "USER_PROP_OPTIONS";
  static OWNER_PROPERTIES_LIST_CACHEKEY = "OWNER_PROPERTIES_LIST";
  static OWNER_PROP_INIT_CACHEKEY = "OWNER_PROP_INIT";
  static GET_PROPERTIES_CACHEKEY = "GET_PROPERTIES";
  static USER_SUBSCRIPTION_PLANS_CACHEKEY = "USER_SUBSCRIPTION_PLANS";
  static GET_SINGLEPROPERTY_SlUG_CACHEKEY = "GET_SINGLEPROPERTY_SlUG";
  static OWNER_PROPERTIES_CACHEKEY = "OWNER_PROPERTIES";
  static OWNER_PROPERTIES_SINGLE_BADGE_CACHEKEY =
    "OWNER_PROPERTIES_SINGLE_BADGE";
  static OWNER_PROPERTIES_SINGLE_AUTH_CACHEKEY = "OWNER_PROPERTIES_SINGLE_AUTH";
  static BOOKMARKS_CACHEKEY = "BOOKMARKS";
  static SINGLE_OWNER_PROPERTY_STATS_CACHEKEY = "SINGLE_OWNER_PROPERTY_STATS";
  static SINGLE_PROPERTY_UPDATE_VIEW_CACHEKEY = "SINGLE_PROPERTY_UPDATE_VIEW";
  static SINGLE_PROPERTY_CONTACT_INFO_CACHEKEY = "SINGLE_PROPERTY_CONTACT_INFO";
  static GET_SINGLEPROPERTY_CALLENDER_CACHEKEY = "GET_SINGLEPROPERTY_CALLENDER";
  static SINGLE_PROPERTY_ADVISOR_SHARE_CACHEKEY =
    "SINGLE_PROPERTY_ADVISOR_SHARE";
  static PROPERTY_RESERVED_DATES_CACHEKEY = "PROPERTY_RESERVED_DATES";
  static OWNER_PROPERTIES_PRICE_RANGE_UPDATE_CACHEKEY =
    "OWNER_PROPERTIES_PRICE_RANGE_UPDATE";

  static async GetUserPropertyGroup(
    dto: {
      group: (keyof typeof PropertyOptionGroup)[];
    },
    signal?: AbortSignal,
  ) {
    try {
      const result = await apiCall<
        { group: string[] },
        { [key: string]: ProvienceTypesDto[] }
      >(
        "GET",
        apiRoutes.USER_PROP_OPTIONS,
        {
          group: dto.group,
        },
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getSinglePropertyContactInfo(dto: {
    propertySlug: string | number | null;
    action: string | number;
  }) {
    try {
      const result = await apiCall<
        { action: string | number },
        {
          list: PropertyContactIInfDto[];
          owner: { selfie_image: ImageDto };
          isPropertyExpired?: boolean;
        }
      >("GET", apiRoutes.SINGLE_PROPERTY_CONTACT_INFO(dto.propertySlug), {
        action: dto?.action,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getSingleAdvisorShare(dto: {
    propertyId: string | number | null;
    elements: string;
  }) {
    try {
      const result = await apiCall<{ elements: string }, string>(
        "GET",
        apiRoutes.SINGLE_PROPERTY_ADVISOR_SHARE(dto.propertyId),
        { elements: dto?.elements },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetPropertySubscriptionPlans(dto?: {
    type?: "ADVISOR" | "PROPERTY";
    property_id?: string | number;
  }, signal?: AbortSignal) {
    try {
      const result = await apiCall<
        { type?: "ADVISOR" | "PROPERTY"; property_id?: string | number },
        { list: PropertySubsDto[]; can_promote: boolean }
      >("GET", apiRoutes.USER_SUBSCRIPTION_PLANS, {
        type: dto?.type,
        property_id: dto?.property_id,
      }, { signal });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async PayPropetySubscription(
    dto: PayPropertySubSendDto & { property_id: string | number | null },
  ) {
    try {
      const result = await apiCall<PayPropertySubSendDto, string>(
        "PUT",
        apiRoutes.OWNER_PROPERTIES_PAY_SUBS(dto?.property_id),
        {
          gateway: dto.gateway,
          photo_upgrade_enabled: dto.photo_upgrade_enabled,
          photo_upgrade_image_ids: dto.photo_upgrade_image_ids,
          photo_upgrade_property_id: dto.photo_upgrade_property_id,
          promote_id: dto.promote_id,
          redirect_url: dto.redirect_url,
          subscription_id: dto.subscription_id,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetSingleOwnerProperty(dto: {
    property_id: string | number | null;
  }, signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, SingleOwnerPropertyDto>(
        "GET",
        apiRoutes.OWNER_PROPERTIES(dto?.property_id), undefined, { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetSingleOwnerPropertyCallendar(dto: {
    property_id: string | number | null;
    year: string | number | null;
    month: string | number | null;
  }, signal?: AbortSignal) {
    try {
      const result = await apiCall<
        { year: string | number | null; month: string | number | null },
        OwnerCallendarItemDto[]
      >("GET", apiRoutes.OWNER_PROPERTIES_SINGLE_CALLENDAR(dto?.property_id), {
        month: dto.month,
        year: dto.year,
      }, { signal });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async UpdatePropertyStatus(dto: {
    property_id: string | number | null;
    year: string | number | null;
    month: string | number | null;
    day: string | number | null;
  }) {
    try {
      const result = await apiCall<
        {
          year: string | number | null;
          month: string | number | null;
          day: string | number | null;
        },
        SingleOwnerPropertyDto
      >("POST", apiRoutes.OWNER_PROPERTIES_STATUS_UPDATE(dto?.property_id), {
        day: dto.day,
        month: dto.month,
        year: dto.year,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async updatePropertyStatusOfManyDays(dto: {
    property_id: string | number | null;
    days: JalaaliDayDto[];
    is_reserved: boolean;
  }) {
    try {
      const result = await apiCall<
        { days: JalaaliDayDto[]; is_reserved: boolean },
        OwnerCallendarItemDto[]
      >(
        "POST",
        apiRoutes.OWNER_PROPERTIES_BULK_STATUS_UPDATE(dto?.property_id),
        {
          days: dto.days,
          is_reserved: dto.is_reserved,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async ownerPropertyPriceRangeLimits(dto: {
    property_id: string | number | null;
    year: string | number | null;
    month: string | number | null;
    day: string | number | null;
  }, signal?: AbortSignal) {
    try {
      const result = await apiCall<
        {
          year: string | number | null;
          month: string | number | null;
          day: string | number | null;
        },
        OwnerPropsRangeDto
      >(
        "GET",
        apiRoutes.OWNER_PROPERTIES_PRICE_RANGE_UPDATE(dto?.property_id),
        {
          year: dto.year,
          month: dto.month,
          day: dto.day,
        },
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async UpdatePropertyPrice(dto: {
    property_id: string | number | null;
    year: string | number | null;
    month: string | number | null;
    day: string | number | null;
    price: string | number | null;
    discounted_price?: string | number | null;
  }) {
    try {
      const result = await apiCall<
        {
          year: string | number | null;
          month: string | number | null;
          day: string | number | null;
          price: string | number | null;
          discounted_price?: string | number | null;
        },
        SingleOwnerPropertyDto
      >("POST", apiRoutes.OWNER_PROPERTIES_PRICE_UPDATE(dto?.property_id), {
        day: dto.day,
        month: dto.month,
        year: dto.year,
        discounted_price: dto.discounted_price,
        price: dto.price,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  /** تغییر قیمت چند روز با هم */
  static async updatePropertyPriceOfManyDays(dto: {
    property_id: string | number | null;
    days: JalaaliDayDto[];
    price: string | number | null;
    discounted_price?: string | number | null;
  }) {
    try {
      const result = await apiCall<
        {
          days: JalaaliDayDto[];
          price: string | number | null;
          discounted_price?: string | number | null;
        },
        OwnerCallendarItemDto[]
      >(
        "POST",
        apiRoutes.OWNER_PROPERTIES_BULK_PRICE_UPDATE(dto?.property_id),
        {
          days: dto.days,
          discounted_price: dto.discounted_price,
          price: dto.price,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async UpdateAdvisorCommission(dto: {
    property_id: string | number | null;
    year: string | number | null;
    month: string | number | null;
    day: string | number | null;
    advisor_commission: string | number | null;
  }) {
    try {
      const result = await apiCall<
        {
          year: string | number | null;
          month: string | number | null;
          day: string | number | null;
          advisor_commission: string | number | null;
        },
        SingleOwnerPropertyDto
      >(
        "POST",
        apiRoutes.OWNER_PROPERTIES_COMMISSION_UPDATE(dto?.property_id),
        {
          day: dto.day,
          month: dto.month,
          year: dto.year,
          advisor_commission: dto.advisor_commission,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async UpdatePropertyAllDaysAdvisorCommission(dto: {
    property_id: string | number | null;

    advisor_commission: string | number | null;
  }) {
    try {
      const result = await apiCall<
        {
          advisor_commission: string | number | null;
        },
        number
      >(
        "PUT",
        apiRoutes.OWNER_PROPERTIES_ALL_DAYS_COMMISSION_UPDATE(dto?.property_id),
        {
          advisor_commission: dto.advisor_commission,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async UpdateCallendarNote(dto: {
    property_id: string | number | null;
    year: string | number | null;
    month: string | number | null;
    day: string | number | null;
    note: string | number | null;
  }) {
    try {
      const result = await apiCall<
        {
          year: string | number | null;
          month: string | number | null;
          day: string | number | null;
          note: string | number | null;
        },
        SingleOwnerPropertyDto
      >(
        "POST",
        apiRoutes.OWNER_PROPERTIES_CALLENDARE_NOTE_UPDATE(dto?.property_id),
        {
          day: dto.day,
          month: dto.month,
          year: dto.year,
          note: dto.note,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                            OWNER PROPERTY BADGE                            */
  /* -------------------------------------------------------------------------- */

  static async GetSingleOwnerPropertyBadgeStatus(dto: {
    property_id: string | number | null;
  }, signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, GetPropBadgeDto>(
        "GET",
        apiRoutes.OWNER_PROPERTIES_SINGLE_BADGE(dto?.property_id), undefined, { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async RequestSingleOwnerPropertyBadge(dto: {
    property_id: string | number | null;
  }) {
    try {
      const result = await apiCall<unknown, unknown>(
        "POST",
        apiRoutes.OWNER_PROPERTIES_SINGLE_BADGE(dto?.property_id),
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                            OWNER PROPERTY AUTHORIZATION                              */
  /* -------------------------------------------------------------------------- */

  static async GetSingleOwnerPropertyAuthStatus(dto: {
    property_id: string | number | null;
  }, signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, OwnerSinglePropertyAuthdata>(
        "GET",
        apiRoutes.OWNER_PROPERTIES_SINGLE_AUTH(dto?.property_id), undefined, { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async RequestSingleOwnerPropertyAuth(dto: {
    property_id: string | number | null;
    nc_image_id: string | number | null;
    docs: (string | number | null)[];
  }) {
    try {
      const result = await apiCall<
        {
          property_id: string | number | null;
          nc_image_id: string | number | null;
          docs: (string | number | null)[];
        },
        unknown
      >("POST", apiRoutes.OWNER_PROPERTIES_AUTHORIZE, {
        docs: dto.docs,
        nc_image_id: dto.nc_image_id,
        property_id: dto.property_id,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async EditRequestSingleOwnerPropertyAuth(dto: {
    property_id: string | number | null;
    nc_image_id: string | number | null;
    docs: (string | number | null)[];
  }) {
    try {
      const result = await apiCall<
        {
          nc_image_id: string | number | null;
          docs: (string | number | null)[];
        },
        unknown
      >("PUT", apiRoutes.OWNER_PROPERTIES_SINGLE_AUTH(dto?.property_id), {
        docs: dto.docs,
        nc_image_id: dto.nc_image_id,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                            CREATE AND EDIT PROP                            */
  /* -------------------------------------------------------------------------- */

  static async InitProperty(dto: { property_id?: string | number | null }, signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, PropInitDto>(
        "GET",
        apiRoutes.OWNER_PROP_INIT(dto?.property_id), undefined, { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertyStepOne(
    dto: CreatePropertyStepOneDto & { propertyId: string | number | null },
  ) {
    try {
      const result = await apiCall<
        CreatePropertyStepOneDto,
        ProvienceTypesDto[]
      >("PUT", apiRoutes.OWNER_PROPERTIES(dto.propertyId), {
        address: dto.address,
        building_area: dto.building_area,
        building_direction: dto.building_direction,
        city_id: dto.city_id,
        construction_year: dto.construction_year,
        floor: dto.floor,
        floors: dto.floors,
        is_chat_enabled: dto.is_chat_enabled,
        is_location_visible: dto.is_location_visible,
        land_area: dto.land_area,
        ownership: dto.ownership,
        property_type: dto.property_type,
        province_id: dto.province_id,
        region_id: dto.region_id,
        title: dto.title,
        unit_per_floor: dto.unit_per_floor,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertySetLocation(dto: {
    propertyId: string | number | null;
    lng: string | number | null;
    lat: string | number | null;
  }) {
    try {
      const result = await apiCall<
        { lng: string | number | null; lat: string | number | null },
        ProvienceTypesDto[]
      >("PUT", apiRoutes.OWNER_PROPERTIES_LOC_UPDATE(dto.propertyId), {
        lat: dto.lat,
        lng: dto.lng,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertySetMdia(dto: {
    propertyId: string | number | null;
    images: (string | number | null)[];
    feature_image_id: string | number | null;
  }) {
    try {
      const { sendMediaSchema } = await import("./property.schema");
      await YupValidator<{
        images: (string | number | null)[];
        feature_image_id: string | number | null;
      }>(dto, sendMediaSchema);

      const result = await apiCall<
        {
          images: (string | number | null)[];
          feature_image_id: string | number | null;
        },
        ProvienceTypesDto[]
      >("PUT", apiRoutes.OWNER_PROPERTIES_MEDIA_UPDATE(dto.propertyId), {
        feature_image_id: dto.feature_image_id,
        images: dto?.images,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }
  static async CreatePropertySetBedroom(
    dto: RoomInfosDto & {
      propertyId: string | number | null;
    },
  ) {
    try {
      const result = await apiCall<RoomInfosDto, ProvienceTypesDto[]>(
        "PUT",
        apiRoutes.OWNER_PROPERTIES_ENV_BEDROOM(dto.propertyId),
        {
          additional_bed: dto.additional_bed,
          bathroom_general: dto?.bathroom_general,
          bathroom_in_wc: dto.bathroom_in_wc,
          bathroom_master: dto.bathroom_master,
          bathroom_tub: dto.bathroom_tub,
          bedrooms: dto.bedrooms,
          master_room: dto.master_room,
          sofa_bed: dto.sofa_bed,
          wc: dto.wc,
          wc_ir: dto.wc_ir,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertySetFacility(
    dto: FacilitiesValuesDto & {
      propertyId: string | number | null;
    },
  ) {
    try {
      const result = await apiCall<FacilitiesValuesDto, ProvienceTypesDto[]>(
        "PUT",
        apiRoutes.OWNER_PROPERTIES_ENV_FACILITY(dto.propertyId),
        {
          cool_heat: dto.cool_heat,
          entertainment: dto.entertainment,
          facility_dscr: dto.facility_dscr,
          has_pool: dto.has_pool || false,
          kitchen: dto.kitchen,
          pool_type: dto.pool_type,
          welfare: dto.welfare,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertySetPrice(
    dto: PricingPropertySendDto & {
      propertyId: string | number | null;
    },
  ) {
    try {
      const result = await apiCall<PricingPropertySendDto, ProvienceTypesDto[]>(
        "PUT",
        apiRoutes.OWNER_PROPERTIES_ENV_PRICE(dto.propertyId),
        {
          additional_person: Number(p2e(dto.additional_person || "")),
          advisor_commission: Number(p2e(dto.advisor_commission || "")),
          cleaning: Number(p2e(dto.cleaning || "")),
          friday: Number(p2e(dto.friday || "")),
          max_capacity: Number(p2e(dto.max_capacity || "")),
          normal: Number(p2e(dto.normal || "")),
          peak: Number(p2e(dto.peak || "")),
          std_capacity: Number(p2e(dto.std_capacity || "")),
          thursday: Number(p2e(dto.thursday || "")),
          wednesday: Number(p2e(dto.wednesday || "")),
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertySetAssistant(
    dto: AssistantSendDto & {
      propertyId: string | number | null;
    },
  ) {
    try {
      const result = await apiCall<AssistantSendDto, ProvienceTypesDto[]>(
        "PUT",
        apiRoutes.OWNER_PROPERTIES_ENV_ASSISTANT(dto.propertyId),
        {
          assistant_full_name: dto.assistant_full_name,
          assistant_mobile: dto.assistant_mobile,
          show_mobile_type: dto.show_mobile_type,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertySetTerms(
    dto: PropertyTermsSendDto & {
      propertyId: string | number | null;
    },
  ) {
    try {
      const result = await apiCall<PropertyTermsSendDto, ProvienceTypesDto[]>(
        "PUT",
        apiRoutes.OWNER_PROPERTIES_ENV_TERMS(dto.propertyId),
        {
          ad_dscr: dto.ad_dscr,
          canceling_type: dto.canceling_type,
          check_in_hour: dto.check_in_hour,
          check_out_hour: dto.check_out_hour,
          doc_dscr: dto.doc_dscr,
          guest_dscr: dto.guest_dscr,
          guest_type: dto.guest_type,
          other_dscr: dto.other_dscr,
          party: dto.party,
          party_dscr: dto.party_dscr,
          pet: dto.pet,
          pet_dscr: dto.pet_dscr,
          property_dscr: dto.property_dscr,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertySetEnv(dto: {
    propertyId: string | number | null;
    distance_dscr: string | number | null;
    pattern_dscr: string | number | null;
    neighborhood: string | number | null;
    access: string | number | null;
    pattern: string | number | null;
  }) {
    try {
      const result = await apiCall<
        {
          distance_dscr: string | number | null;
          pattern_dscr: string | number | null;
          neighborhood: string | number | null;
          access: string | number | null;
          pattern: string | number | null;
        },
        ProvienceTypesDto[]
      >("PUT", apiRoutes.OWNER_PROPERTIES_ENV_UPDATE(dto.propertyId), {
        access: dto.access,
        distance_dscr: dto.distance_dscr,
        neighborhood: dto.neighborhood,
        pattern: dto.pattern,
        pattern_dscr: dto.pattern_dscr,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             GET PROPERTIES PART                            */
  /* -------------------------------------------------------------------------- */

  static async GetProperties(dto: GetPropertiesPlusFilters, signal?: AbortSignal) {
    try {
      const result = await apiCall<
        GetPropertiesPlusFilters,
        { data: PropertyListDto[]; meta: PageMetaDto }
      >("GET", apiRoutes.GET_PROPERTIES, dto, { signal });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetSinglePropertyWithSlug(dto: { Property_slug: string }, signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, SinglePropDto>(
        "GET",
        apiRoutes.GET_SINGLEPROPERTY_SlUG(dto.Property_slug),
        undefined,
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                            GET OWNER PORPERTIES                            */
  /* -------------------------------------------------------------------------- */

  static async GetOwnerPropertiesList(signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, PropertyListDto[]>(
        "GET",
        apiRoutes.OWNER_PROPERTIES_LIST, undefined, { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             SAVE LIKE PROPERTY                             */
  /* -------------------------------------------------------------------------- */

  static async LikeProperty(dto: { property_id: string | number | null }) {
    try {
      const result = await apiCall<
        {
          property_id: string | number | null;
        },
        { favorites: number[] }
      >("POST", apiRoutes.FAVS, {
        property_id: dto.property_id,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getBookMarks(signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, PropertyListDto[]>(
        "GET",
        apiRoutes.BOOKMARKS,
        undefined,
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async BookmarkProperty(dto: { property_id: string | number | null }) {
    try {
      const result = await apiCall<
        {
          property_id: string | number | null;
        },
        { bookmarks: number[] }
      >("POST", apiRoutes.BOOKMARKS, {
        property_id: dto.property_id,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               DELETE PROPERTY                              */
  /* -------------------------------------------------------------------------- */
  static async deleteProperty(dto: { propertyId: string | number | null }) {
    try {
      const result = await apiCall<
        { lng: string | number | null; lat: string | number | null },
        ProvienceTypesDto[]
      >("DELETE", apiRoutes.SINGLE_OWNER_PROPERTY(dto.propertyId));
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               GET PROPERTY STATISTICS                               */
  /* -------------------------------------------------------------------------- */

  static async getPropertyStatistics(dto: {
    propertyId: string | number | null;
  }, signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, PropertyStatsDto>(
        "GET",
        apiRoutes.SINGLE_OWNER_PROPERTY_STATS(dto.propertyId), undefined, { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async updatePropertyView(dto: {
    propertyId: string | number | null;
    fingerprint: string | number | null;
  }) {
    try {
      const result = await apiCall<
        { fingerprint: string | number | null },
        unknown
      >("PUT", apiRoutes.SINGLE_PROPERTY_UPDATE_VIEW(dto.propertyId), {
        fingerprint: dto.fingerprint,
      });
      return result || null;
    } catch (e) {
      throw e;
    }
  }

  static async GetSingleUserPropertyCallendar(dto: {
    property_id: string | number | null;
    year: string | number | null;
    month: string | number | null;
  }, signal?: AbortSignal) {
    try {
      const result = await apiCall<
        { year: string | number | null; month: string | number | null },
        OwnerCallendarItemDto[]
      >("GET", apiRoutes.GET_SINGLEPROPERTY_CALLENDER(dto?.property_id), {
        month: dto.month,
        year: dto.year,
      }, { signal });
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                 REPORT PROPERTY                                */
  /* -------------------------------------------------------------------------- */

  static async reportPost(dto: {
    post_id: string | number;
    title: string;
    description: string;
  }) {
    try {
      const result = await apiCall<
        {
          title: string;
          description: string;
        },
        unknown
      >("POST", apiRoutes.PROPERTY_REPORT(dto.post_id), {
        description: dto?.description,
        title: dto?.title,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             PROPERTY rESERVEDDATES                               */
  /* -------------------------------------------------------------------------- */

  static async propertyReservedDates(dto: { post_id: string | number }, signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, Date[]>(
        "GET",
        apiRoutes.PROPERTY_RESERVED_DATES(dto.post_id),
        undefined,
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
}
