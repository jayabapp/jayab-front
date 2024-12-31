import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { CreatePropertyStepOneDto, PropertyTypesDTP, PropInitDto } from "./property.interface";
import { YupValidator } from "@/utils/YupValidator";
import { sendMediaSchema } from "./property.schema";

export class PropertyService {
  static USER_PROP_OPTIONS_CACHEKEY = "USER_PROP_OPTIONS";
  static OWNER_PROP_INIT_CACHEKEY = "OWNER_PROP_INIT";

  static async GetUserPropertyGroup(dto: { group: string }) {
    try {
      const result = await apiCall<{ group: string }, PropertyTypesDTP[]>("GET", apiRoutes.USER_PROP_OPTIONS, {
        group: dto.group,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async InitProperty() {
    try {
      const result = await apiCall<unknown, PropInitDto>("GET", apiRoutes.OWNER_PROP_INIT);
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
        "PATCH",
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
      >("PATCH", apiRoutes.OWNER_PROPERTIES_MEDIA_UPDATE(dto.propertyId), {
        feature_image_id: dto.feature_image_id,
        images: dto?.images,
      });
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
      >("PATCH", apiRoutes.OWNER_PROPERTIES_ENV_UPDATE(dto.propertyId), {
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
}
