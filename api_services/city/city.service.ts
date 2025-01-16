import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { PropertyTypesDTP } from "../property/property.interface";

export class CityService {
  static CITIES_CACHEKEY = "CITIES";
  static CITIES_CHILDEREN_CACHEKEY = "CITIES_CHILDEREN";
  static async GetProvince() {
    try {
      const result = await apiCall<unknown, PropertyTypesDTP[]>("GET", apiRoutes.CITIES);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetCities(dto: { parentId: string | number }) {
    try {
      const result = await apiCall<unknown, PropertyTypesDTP[]>("GET", apiRoutes.CITIES_CHILDEREN(dto.parentId));
      return result;
    } catch (e) {
      throw e;
    }
  }
}
