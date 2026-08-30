import { ContentDto, QuestionDto, SearchSuggDto } from "./home.interface";
import { CitySuggestDto, ContentByKeyDto } from "./home.interface";
import { CMS_CONTENT_CACHE_KEY } from "./cms-content";
import { LandingsPlacements } from "@/enum/landings.enum";
import { MostVisitedPlaces } from "./home.interface";
import { BannerPosition } from "@/enum/banners.enum";
import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { Meta } from "../chat/chat.interface";

export class HomeService {
  static BANNERS_RANDOM_CACHEKEY = "BANNERS_RANDOM";
  static CONTENTS_CACHEKEY = "CONTENTS";
  static CONTENT_BY_KEY_CACHEKEY = CMS_CONTENT_CACHE_KEY;
  static SEARCH_SUGGS_CACHEKEY = "SEARCH_SUGGS";
  static CONTENT_QUESTIONS_KEY = "CONTENTQUESTIONSKEY";
  static SEARCH_KEY = "SEARCH";
  static USER_LANDING_PAGES_KEY = "USER_LANDING_PAGES";
  static SETTING_KEY = "SETTING";

  static async GetBanners(
    dto: { positions: BannerPosition[] },
    signal?: AbortSignal,
  ) {
    try {
      const result = await apiCall<
        { positions: BannerPosition[] },
        { [key: string]: any[] }
      >(
        "GET",
        apiRoutes.BANNERS,
        {
          positions: dto?.positions,
        },
        { version: "v2", signal },
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

  static async getLandings(
    dto?: { placement?: LandingsPlacements },
    signal?: AbortSignal,
  ) {
    try {
      const result = await apiCall<
        { placement?: LandingsPlacements },
        MostVisitedPlaces
      >("GET", apiRoutes.USER_LANDING_PAGES, dto, { signal });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetContent(
    dto: {
      key: string;
      page: number;
      per_page?: number;
    },
    signal?: AbortSignal,
  ) {
    try {
      const result = await apiCall<
        { key: string; page: number; per_page?: number },
        { data: ContentDto[]; meta: Meta }
      >(
        "GET",
        apiRoutes.CONTENTS,
        {
          key: dto?.key,
          page: dto?.page,
          per_page: dto?.per_page,
        },
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetContentByKey(dto: { key: string }, signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, ContentByKeyDto>(
        "GET",
        apiRoutes.CONTENT_BY_KEY(dto?.key),
        undefined,
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetSearchSuggs(dto: { q?: string }, signal?: AbortSignal) {
    try {
      const result = await apiCall<{ q?: string }, SearchSuggDto>(
        "GET",
        apiRoutes.SEARCH_SUGGS,
        {
          q: dto?.q,
        },
        { version: "v2", signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async Search(dto: { q?: string }, signal?: AbortSignal) {
    try {
      const result = await apiCall<
        { q?: string },
        { client_query: { [key: string]: any }; cities_list: CitySuggestDto[] }
      >(
        "GET",
        apiRoutes.SEARCH,
        {
          q: dto?.q,
        },
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async FindAllComments(
    dto: {
      page: number;
      per_page: number;
      content_id?: number | string;
      product_id?: number | string;
    },
    signal?: AbortSignal,
  ) {
    try {
      const result = await apiCall<
        {
          page: number;
          per_page: number;
          content_id?: number | string;
          product_id?: number | string;
        },
        { data: QuestionDto[]; meta: Meta } | null
      >("GET", apiRoutes.CONTENTS_QUESTIONS, dto, { signal });
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

  static async getSettings() {
    try {
      const result = await apiCall<unknown, { photo_upgrade_price: string }>(
        "GET",
        apiRoutes.SETTING,
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
}
