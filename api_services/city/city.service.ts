import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { ProvienceTypesDto } from "../property/property.interface";
import { NewCitiesListDto } from "./city.interface";

export class CityService {
  static CITIES_CACHEKEY = "CITIES";
  static GET_ALL_CITIES_CACHEKEY = "GET_ALL_CITIES";
  static CITIES_CHILDEREN_CACHEKEY = "CITIES_CHILDEREN";
  static async GetProvince() {
    try {
      const result = await apiCall<unknown, ProvienceTypesDto[]>("GET", apiRoutes.CITIES);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetCities(dto: { parentId: string | number }) {
    try {
      const result = await apiCall<unknown, ProvienceTypesDto[]>("GET", apiRoutes.CITIES_CHILDEREN(dto.parentId));
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetAllCities(dto?: {
    cities?: string | null | number;
    depth?: string | null | number;
    is_parent?: boolean;
    q?: string | null | number;
  }) {
    try {
      const result = await apiCall<
        {
          cities?: string | null | number;
          depth?: string | null | number;
          is_parent?: boolean;
          q?: string | null | number;
        },
        NewCitiesListDto[]
      >("GET", apiRoutes.CITIES, dto);
      return result;
    } catch (e) {
      throw e;
    }
  }
}
