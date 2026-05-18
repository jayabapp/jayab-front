import { BannerPosition } from "@/enum/banners.enum";
import { apiRoutes } from "@/utils/urls";
import { Meta } from "../chat/chat.interface";
import { apiCall } from "../common/apicall.helper";
import {
  CitySuggestDto,
  ContentByKeyDto,
  ContentDto,
  MostVisitedPlaces,
  QuestionDto,
  SearchSuggDto,
} from "./home.interface";

export class HomeService {
  // static FORGOT_PASSWORD_LIST_CACHEKEY = "FORGOT_PASSWORD_LIST";
  static BANNERS_RANDOM_CACHEKEY = "BANNERS_RANDOM";
  static CONTENTS_CACHEKEY = "CONTENTS";
  // static SETTINGS_CACHEKEY = "SETTINGS";
  // static GET_SINGLE_CONTENT_CACHEKEY = "GET_SINGLE_CONTENT";
  // static GET_BRANDS_CACHEKEY = "GET_BRANDS";
  static CONTENT_BY_KEY_CACHEKEY = "CONTENT_BY_KEY";
  static SEARCH_SUGGS_CACHEKEY = "SEARCH_SUGGS";
  static CONTENT_QUESTIONS_KEY = "CONTENTQUESTIONSKEY";
  static SEARCH_KEY = "SEARCH";
  static USER_LANDING_PAGES_KEY = "USER_LANDING_PAGES";

  static async GetBanners(dto: { positions: BannerPosition[] }) {
    try {
      const result = await apiCall<{ positions: BannerPosition[] }, { [key: string]: any[] }>(
        "GET",
        apiRoutes.BANNERS,
        {
          positions: dto?.positions,
        },
        { version: "v2" },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async updateBannerViewCount(body: { bannerId: number | string }) {
    try {
      const result = await apiCall<
        {
          bannerId?: number | string;
        },
        unknown
      >("PATCH", apiRoutes.BANNER_VIEW_COUNT(body.bannerId), body);
      return result;
    } catch (e) {
      throw e;
    }
  }

  //////////////////////////////
  static async getLandings() {
    try {
      const result = await apiCall<any, MostVisitedPlaces>("GET", apiRoutes.USER_LANDING_PAGES);
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
        },
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
      const result = await apiCall<{ q?: string }, SearchSuggDto>(
        "GET",
        apiRoutes.SEARCH_SUGGS,
        {
          q: dto?.q,
        },
        { version: "v2" },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async Search(dto: { q?: string }) {
    try {
      const result = await apiCall<
        { q?: string },
        { client_query: { [key: string]: any }; cities_list: CitySuggestDto[] }
      >("GET", apiRoutes.SEARCH, {
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

  static async FindAllComments(
    dto: { page: number; per_page: number; content_id?: number | string; product_id?: number | string },
    callback?: (a?: { data: QuestionDto[]; meta: Meta } | null) => void,
  ) {
    try {
      const result = await apiCall<
        { page: number; per_page: number; content_id?: number | string; product_id?: number | string },
        { data: QuestionDto[]; meta: Meta } | null
      >("GET", apiRoutes.CONTENTS_QUESTIONS, dto);
      if (!!callback) {
        callback(result);
      }
      return result || null;
    } catch (e) {
      throw e;
    }
  }

  static async SendQuestion(body: {
    content_id?: number | string;

    rate?: number;
    author_name: string;
    mobile_number: string;
    question: string;
    product_id?: number | string;
  }) {
    try {
      const result = await apiCall<
        {
          product_id?: number | string;
          content_id?: number | string;
          rate?: number;
          author_name: string;
          mobile_number: string;
          question: string;
        },
        unknown
      >("POST", apiRoutes.CONTENTS_QUESTIONS, body);
      return result;
    } catch (e) {
      throw e;
    }
  }
}
