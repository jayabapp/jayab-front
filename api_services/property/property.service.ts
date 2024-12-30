import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { CreatePropertyStepOneDto, PropertyTypesDTP, PropInitDto } from "./property.interface";

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
}
