import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import {
  AssistantSendDto,
  CreatePropertyStepOneDto,
  FacilitiesValuesDto,
  PayPropertySubSendDto,
  PricingPropertySendDto,
  PropertyListDto,
  PropertyOptionGroup,
  PropertySubsDto,
  PropertyTermsSendDto,
  PropertyTypesDTP,
  PropInitDto,
  RoomInfosDto,
} from "./property.interface";
import { YupValidator } from "@/utils/YupValidator";
import { sendMediaSchema } from "./property.schema";
import { p2e } from "@/helpers/NumberConverter";

export class PropertyService {
  static USER_PROP_OPTIONS_CACHEKEY = "USER_PROP_OPTIONS";
  static OWNER_PROP_INIT_CACHEKEY = "OWNER_PROP_INIT";
  static GET_PROPERTIES_CACHEKEY = "GET_PROPERTIES";
  static USER_SUBSCRIPTION_PLANS_CACHEKEY = "USER_SUBSCRIPTION_PLANS";
  static GET_SINGLEPROPERTY_SlUG_CACHEKEY = "GET_SINGLEPROPERTY_SlUG";

  static async GetUserPropertyGroup(dto: { group: (keyof typeof PropertyOptionGroup)[] }) {
    try {
      const result = await apiCall<{ group: string[] }, { [key: string]: PropertyTypesDTP[] }>(
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
      const result = await apiCall<CreatePropertyStepOneDto, PropertyTypesDTP[]>(
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
      const result = await apiCall<{ lng: string | number | null; lat: string | number | null }, PropertyTypesDTP[]>(
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
        PropertyTypesDTP[]
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
      const result = await apiCall<RoomInfosDto, PropertyTypesDTP[]>(
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
      const result = await apiCall<FacilitiesValuesDto, PropertyTypesDTP[]>(
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
      const result = await apiCall<PricingPropertySendDto, PropertyTypesDTP[]>(
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
      const result = await apiCall<AssistantSendDto, PropertyTypesDTP[]>(
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
      const result = await apiCall<PropertyTermsSendDto, PropertyTypesDTP[]>(
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
        PropertyTypesDTP[]
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

  static async GetProperties(dto: { cursor: number }) {
    try {
      const result = await apiCall<{ cursor: number }, { data: PropertyListDto[] }>("GET", apiRoutes.GET_PROPERTIES, {
        cursor: dto.cursor,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetSinglePropertyWithSlug(dto: { Property_slug: string }) {
    try {
      const result = await apiCall<unknown, unknown>("GET", apiRoutes.GET_SINGLEPROPERTY_SlUG(dto.Property_slug));
      return result;
    } catch (e) {
      throw e;
    }
  }
}
