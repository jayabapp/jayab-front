import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import {
  AssistantSendDto,
  CreatePropertyStepOneDto,
  FacilitiesValuesDto,
  GetPropBadgeDto,
  OwnerCallendarItemDto,
  OwnerSinglePropertyAuthdata,
  PayPropertySubSendDto,
  PricingPropertySendDto,
  PropertyListDto,
  PropertyOptionGroup,
  PropertyStatsDto,
  PropertySubsDto,
  PropertyTermsSendDto,
  ProvienceTypesDto,
  PropInitDto,
  RoomInfosDto,
  SingleOwnerPropertyDto,
  GetPropertiesPlusFilters,
  PropertyContactIInfDto,
  SinglePropDto,
} from "./property.interface";
import { YupValidator } from "@/utils/YupValidator";
import { sendMediaSchema } from "./property.schema";
import { p2e } from "@/helpers/NumberConverter";

export class PropertyService {
  static USER_PROP_OPTIONS_CACHEKEY = "USER_PROP_OPTIONS";
  static OWNER_PROPERTIES_LIST_CACHEKEY = "OWNER_PROPERTIES_LIST";
  static OWNER_PROP_INIT_CACHEKEY = "OWNER_PROP_INIT";
  static GET_PROPERTIES_CACHEKEY = "GET_PROPERTIES";
  static USER_SUBSCRIPTION_PLANS_CACHEKEY = "USER_SUBSCRIPTION_PLANS";
  static GET_SINGLEPROPERTY_SlUG_CACHEKEY = "GET_SINGLEPROPERTY_SlUG";
  static OWNER_PROPERTIES_CACHEKEY = "OWNER_PROPERTIES";
  static OWNER_PROPERTIES_SINGLE_BADGE_CACHEKEY = "OWNER_PROPERTIES_SINGLE_BADGE";
  static OWNER_PROPERTIES_SINGLE_AUTH_CACHEKEY = "OWNER_PROPERTIES_SINGLE_AUTH";
  static BOOKMARKS_CACHEKEY = "BOOKMARKS";
  static SINGLE_OWNER_PROPERTY_STATS_CACHEKEY = "SINGLE_OWNER_PROPERTY_STATS";
  static SINGLE_PROPERTY_UPDATE_VIEW_CACHEKEY = "SINGLE_PROPERTY_UPDATE_VIEW";
  static SINGLE_PROPERTY_CONTACT_INFO_CACHEKEY = "SINGLE_PROPERTY_CONTACT_INFO";

  static async GetUserPropertyGroup(dto: { group: (keyof typeof PropertyOptionGroup)[] }) {
    try {
      const result = await apiCall<{ group: string[] }, { [key: string]: ProvienceTypesDto[] }>(
        "GET",
        apiRoutes.USER_PROP_OPTIONS,
        {
          group: dto.group,
        }
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                            PROPERTY CONTACT INFO                           */
  /* -------------------------------------------------------------------------- */

  static async getSinglePropertyContactInfo(dto: { propertySlug: string | number | null }) {
    try {
      const result = await apiCall<unknown, PropertyContactIInfDto[]>(
        "GET",
        apiRoutes.SINGLE_PROPERTY_CONTACT_INFO(dto.propertySlug)
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              SUBSCRIPTION PART                             */
  /* -------------------------------------------------------------------------- */

  static async GetPropertySubscriptionPlans(dto?: { type?: "ADVISOR" | "PROPERTY"; property_id?: string | number }) {
    try {
      const result = await apiCall<
        { type?: "ADVISOR" | "PROPERTY"; property_id?: string | number },
        { list: PropertySubsDto[]; can_promote: boolean }
      >("GET", apiRoutes.USER_SUBSCRIPTION_PLANS, {
        type: dto?.type,
        property_id: dto?.property_id,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async PayPropetySubscription(dto: PayPropertySubSendDto & { property_id: string | number | null }) {
    try {
      const result = await apiCall<PayPropertySubSendDto, string>(
        "PUT",
        apiRoutes.OWNER_PROPERTIES_PAY_SUBS(dto?.property_id),
        {
          gateway: dto.gateway,
          promote_id: dto.promote_id,
          redirect_url: dto.redirect_url,
          subscription_id: dto.subscription_id,
        }
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                          GET OWNER SINGLE PROPERTY                         */
  /* -------------------------------------------------------------------------- */

  static async GetSingleOwnerProperty(dto: { property_id: string | number | null }) {
    try {
      const result = await apiCall<unknown, SingleOwnerPropertyDto>(
        "GET",
        apiRoutes.OWNER_PROPERTIES(dto?.property_id)
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
  }) {
    try {
      const result = await apiCall<
        { year: string | number | null; month: string | number | null },
        OwnerCallendarItemDto[]
      >("GET", apiRoutes.OWNER_PROPERTIES_SINGLE_CALLENDAR(dto?.property_id), {
        month: dto.month,
        year: dto.year,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                        OWNER PROPERTY UPDATE STATUSES                        */
  /* -------------------------------------------------------------------------- */

  static async UpdatePropertyStatus(dto: {
    property_id: string | number | null;
    year: string | number | null;
    month: string | number | null;
    day: string | number | null;
  }) {
    try {
      const result = await apiCall<
        { year: string | number | null; month: string | number | null; day: string | number | null },
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

  static async UpdatePropertyPrice(dto: {
    property_id: string | number | null;
    year: string | number | null;
    month: string | number | null;
    day: string | number | null;
    price: string | number | null;
    discounted_price: string | number | null;
  }) {
    try {
      const result = await apiCall<
        {
          year: string | number | null;
          month: string | number | null;
          day: string | number | null;
          price: string | number | null;
          discounted_price: string | number | null;
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
      >("POST", apiRoutes.OWNER_PROPERTIES_COMMISSION_UPDATE(dto?.property_id), {
        day: dto.day,
        month: dto.month,
        year: dto.year,
        advisor_commission: dto.advisor_commission,
      });
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
      >("PUT", apiRoutes.OWNER_PROPERTIES_ALL_DAYS_COMMISSION_UPDATE(dto?.property_id), {
        advisor_commission: dto.advisor_commission,
      });
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
      >("POST", apiRoutes.OWNER_PROPERTIES_CALLENDARE_NOTE_UPDATE(dto?.property_id), {
        day: dto.day,
        month: dto.month,
        year: dto.year,
        note: dto.note,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                            OWNER PROPERTY BADGE                            */
  /* -------------------------------------------------------------------------- */

  static async GetSingleOwnerPropertyBadgeStatus(dto: { property_id: string | number | null }) {
    try {
      const result = await apiCall<unknown, GetPropBadgeDto>(
        "GET",
        apiRoutes.OWNER_PROPERTIES_SINGLE_BADGE(dto?.property_id)
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async RequestSingleOwnerPropertyBadge(dto: { property_id: string | number | null }) {
    try {
      const result = await apiCall<unknown, unknown>("POST", apiRoutes.OWNER_PROPERTIES_SINGLE_BADGE(dto?.property_id));
      return result;
    } catch (e) {
      throw e;
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                            OWNER PROPERTY AUTHORIZATION                              */
  /* -------------------------------------------------------------------------- */

  static async GetSingleOwnerPropertyAuthStatus(dto: { property_id: string | number | null }) {
    try {
      const result = await apiCall<unknown, OwnerSinglePropertyAuthdata>(
        "GET",
        apiRoutes.OWNER_PROPERTIES_SINGLE_AUTH(dto?.property_id)
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

  static async InitProperty(dto: { property_id?: string | number | null }) {
    try {
      const result = await apiCall<unknown, PropInitDto>("GET", apiRoutes.OWNER_PROP_INIT(dto?.property_id));
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertyStepOne(dto: CreatePropertyStepOneDto & { propertyId: string | number | null }) {
    try {
      const result = await apiCall<CreatePropertyStepOneDto, ProvienceTypesDto[]>(
        "PUT",
        apiRoutes.OWNER_PROPERTIES(dto.propertyId),
        {
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
          // region_id:dto.region_id,
          title: dto.title,
          unit_per_floor: dto.unit_per_floor,
        }
      );
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
      const result = await apiCall<{ lng: string | number | null; lat: string | number | null }, ProvienceTypesDto[]>(
        "PUT",
        apiRoutes.OWNER_PROPERTIES_LOC_UPDATE(dto.propertyId),
        {
          lat: dto.lat,
          lng: dto.lng,
        }
      );
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
      await YupValidator<{ images: (string | number | null)[]; feature_image_id: string | number | null }>(
        dto,
        sendMediaSchema
      );

      const result = await apiCall<
        { images: (string | number | null)[]; feature_image_id: string | number | null },
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
    }
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
        }
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertySetFacility(
    dto: FacilitiesValuesDto & {
      propertyId: string | number | null;
    }
  ) {
    try {
      const result = await apiCall<FacilitiesValuesDto, ProvienceTypesDto[]>(
        "PUT",
        apiRoutes.OWNER_PROPERTIES_ENV_FACILITY(dto.propertyId),
        {
          cool_heat: dto.cool_heat,
          entertainment: dto.entertainment,
          facility_dscr: dto.facility_dscr,
          has_pool: dto.has_pool,
          kitchen: dto.kitchen,
          pool_type: dto.pool_type,
          welfare: dto.welfare,
        }
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertySetPrice(
    dto: PricingPropertySendDto & {
      propertyId: string | number | null;
    }
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
        }
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertySetAssistant(
    dto: AssistantSendDto & {
      propertyId: string | number | null;
    }
  ) {
    try {
      const result = await apiCall<AssistantSendDto, ProvienceTypesDto[]>(
        "PUT",
        apiRoutes.OWNER_PROPERTIES_ENV_ASSISTANT(dto.propertyId),
        {
          assistant_full_name: dto.assistant_full_name,
          assistant_mobile: dto.assistant_mobile,
          show_mobile_type: dto.show_mobile_type,
        }
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async CreatePropertySetTerms(
    dto: PropertyTermsSendDto & {
      propertyId: string | number | null;
    }
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
        }
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

  static async GetProperties(dto: GetPropertiesPlusFilters) {
    try {
      const result = await apiCall<GetPropertiesPlusFilters, { data: PropertyListDto[] }>(
        "GET",
        apiRoutes.GET_PROPERTIES,
        dto
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetSinglePropertyWithSlug(dto: { Property_slug: string }) {
    try {
      const result = await apiCall<unknown, SinglePropDto>("GET", apiRoutes.GET_SINGLEPROPERTY_SlUG(dto.Property_slug));
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                            GET OWNER PORPERTIES                            */
  /* -------------------------------------------------------------------------- */

  static async GetOwnerPropertiesList() {
    try {
      const result = await apiCall<unknown, PropertyListDto[]>("GET", apiRoutes.OWNER_PROPERTIES_LIST);
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

  static async getBookMarks() {
    try {
      const result = await apiCall<unknown, PropertyListDto[]>("GET", apiRoutes.BOOKMARKS);
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
      const result = await apiCall<{ lng: string | number | null; lat: string | number | null }, ProvienceTypesDto[]>(
        "DELETE",
        apiRoutes.SINGLE_OWNER_PROPERTY(dto.propertyId)
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               GET PROPERTY STATISTICS                               */
  /* -------------------------------------------------------------------------- */

  static async getPropertyStatistics(dto: { propertyId: string | number | null }) {
    try {
      const result = await apiCall<unknown, PropertyStatsDto>(
        "GET",
        apiRoutes.SINGLE_OWNER_PROPERTY_STATS(dto.propertyId)
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async updatePropertyView(dto: { propertyId: string | number | null; fingerprint: string | number | null }) {
    try {
      const result = await apiCall<{ fingerprint: string | number | null }, unknown>(
        "PUT",
        apiRoutes.SINGLE_PROPERTY_UPDATE_VIEW(dto.propertyId),
        {
          fingerprint: dto.fingerprint,
        }
      );
      return result || null;
    } catch (e) {
      throw e;
    }
  }
}
