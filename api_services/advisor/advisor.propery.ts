import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import {
  AddRateDto,
  AdvisorPageListDto,
  AdvisorProfileDto,
  CreateAdvisorDto,
  PayAdvisorPlanDto,
  SingleAdvisorDto,
} from "./advisor.interface";
import { GetProfileDto } from "../auth/auth.interface";

export class AdvisorService {
  static USER_ADVISORS_CACHEKEY = "USER_ADVISORS";
  static USER_ADVISORS_PROFILE_CACHEKEY = "USER_ADVISORS_PROFILE";
  static SINGLE_ADVISOR_CACHEKEY = "SINGLE_ADVISOR";

  static async createAdvisor(dto: CreateAdvisorDto) {
    try {
      const result = await apiCall<CreateAdvisorDto, GetProfileDto>("PUT", apiRoutes.PROFILE_REGISTER_ADVISORS, dto);
      return result;
    } catch (e) {
      throw e;
    }
  }
  static async payAdvisorPlan(dto: PayAdvisorPlanDto) {
    try {
      const result = await apiCall<PayAdvisorPlanDto, string>("POST", apiRoutes.PAY_ADVISOR_PLAN, dto);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async userAdvisorsList(dto: {
    per_page: number;
    cursor: number;
    q?: string;
    cities?: (number | string)[];
    province_id?: string | number;
  }, signal?: AbortSignal) {
    try {
      const result = await apiCall<
        { per_page: number; cursor: number; q?: string; cities?: (number | string)[]; province_id?: string | number },
        AdvisorPageListDto[]
      >("GET", apiRoutes.USER_ADVISORS, {
        cursor: dto.cursor,
        per_page: dto.per_page,
        q: dto.q,
        cities: dto.cities,
        province_id: dto.province_id,
      }, { signal });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async userAdvisorsProfile(signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, AdvisorProfileDto | null>("GET", apiRoutes.USER_ADVISORS_PROFILE, undefined, { signal });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async singleAdvisor(dto: { advisorId: string | number }, signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, SingleAdvisorDto | null>("GET", apiRoutes.SINGLE_ADVISOR(dto.advisorId), undefined, { signal });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async singleAdvisorInitContact(dto: { advisorId: string | number | null }) {
    try {
      const result = await apiCall<unknown, unknown | null>("POST", apiRoutes.SINGLE_ADVISOR_INIT_RATE(dto.advisorId));
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async singleAdvisorRate(dto: AddRateDto & { advisorId: string | number | null }) {
    try {
      const result = await apiCall<AddRateDto, unknown | null>("POST", apiRoutes.SINGLE_ADVISOR_RATE(dto.advisorId), {
        advisor_behavior: dto.advisor_behavior,
        advisor_responsibility: dto.advisor_responsibility,
        response_speed_and_followup: dto.response_speed_and_followup,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                 DELETE SUB                                 */
  /* -------------------------------------------------------------------------- */

  static async deleteAdvisorSub() {
    try {
      const result = await apiCall<unknown, any>("DELETE", apiRoutes.PAY_ADVISOR_PLAN);
      return result;
    } catch (e) {
      throw e;
    }
  }
}
