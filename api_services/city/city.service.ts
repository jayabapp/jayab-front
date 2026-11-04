import { ProvienceTypesDto } from "../property/property.interface";
import { NewCitiesListDto } from "./city.interface";
import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";

import type { Locale } from "@/i18n/config";

export class CityService {
  static CITIES_CACHEKEY = "CITIES";
  static GET_ALL_CITIES_CACHEKEY = "GET_ALL_CITIES";
  static CITIES_CHILDEREN_CACHEKEY = "CITIES_CHILDEREN";
  static async GetProvince() {
    try {
      const result = await apiCall<unknown, ProvienceTypesDto[]>(
        "GET",
        apiRoutes.CITIES,
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetCities(dto: { parentId: string | number; locale?: Locale }) {
    try {
      const result = await apiCall<{ locale?: Locale }, ProvienceTypesDto[]>(
        "GET",
        apiRoutes.CITIES_CHILDEREN(dto.parentId),
        { locale: dto.locale },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetAllCities(
    dto?: {
      cities?: string | null | number;
      depth?: string | null | number;
      is_parent?: string | null | number;
      q?: string | null | number;
      locale?: Locale;
    },
    signal?: AbortSignal,
  ) {
    try {
      const result = await apiCall<
        {
          cities?: string | null | number;
          depth?: string | null | number;
          is_parent?: string | null | number;
          q?: string | null | number;
          locale?: Locale;
        },
        NewCitiesListDto[]
      >("GET", apiRoutes.CITIES, dto, { signal });
      return result;
    } catch (e) {
      throw e;
    }
  }
}
