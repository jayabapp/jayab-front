import { apiRoutes } from "@/utils/urls";
import { ContentByKeyDto, ContentDto } from "./home.interface";
import { apiCall } from "../common/apicall.helper";

export class HomeService {
  // static FORGOT_PASSWORD_LIST_CACHEKEY = "FORGOT_PASSWORD_LIST";
  static BANNERS_RANDOM_CACHEKEY = "BANNERS_RANDOM";
  static CONTENTS_CACHEKEY = "CONTENTS";
  // static SETTINGS_CACHEKEY = "SETTINGS";
  // static GET_SINGLE_CONTENT_CACHEKEY = "GET_SINGLE_CONTENT";
  // static GET_BRANDS_CACHEKEY = "GET_BRANDS";
  static CONTENT_BY_KEY_CACHEKEY = "CONTENT_BY_KEY";
  static SEARCH_SUGGS_CACHEKEY = "SEARCH_SUGGS";

  static async GetBanners(dto: { position: "main_sidebar" | "advisor" }) {
    try {
      const result = await apiCall<{ position: "main_sidebar" | "advisor" }, unknown[]>("GET", apiRoutes.BANNERS, {
        position: dto?.position,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  // static async GetHomeSettings() {
  //   try {
  //     const result = await apiCall<unknown, HomeSttingsDto[]>("GET", apiRoutes.SETTINGS);
  //     return result;
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  static async GetContent(dto: { key: string; page: number; per_page?: number }) {
    try {
      const result = await apiCall<{ key: string; page: number; per_page?: number }, { data: ContentDto[]; meta: any }>(
        "GET",
        apiRoutes.CONTENTS,
        {
          key: dto?.key,
          page: dto?.page,
          per_page: dto?.per_page,
        }
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetContentByKey(dto: { key: string }) {
    try {
      const result = await apiCall<unknown, ContentByKeyDto>("GET", apiRoutes.CONTENT_BY_KEY(dto?.key));
      return result;
    } catch (e) {
      throw e;
    }
  }

  // static async GetBrands() {
  //   try {
  //     const result = await apiCall<unknown, { data: { id: number; title: string; image: Image }[] }>(
  //       "GET",
  //       apiRoutes.GET_BRANDS,
  //       {
  //         cursor: 0,
  //       }
  //     );
  //     return result;
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  static async GetSearchSuggs(dto: { q?: string }) {
    try {
      const result = await apiCall<{ q?: string }, unknown>("GET", apiRoutes.SEARCH_SUGGS, {
        q: dto?.q,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  // static async GetSingleContent(dto: { contentId: string | number }) {
  //   try {
  //     const result = await apiCall<unknown, SingleContentDto>("GET", apiRoutes.GET_SINGLE_CONTENT(dto?.contentId));
  //     return result;
  //   } catch (e) {
  //     throw e;
  //   }
  // }
}
