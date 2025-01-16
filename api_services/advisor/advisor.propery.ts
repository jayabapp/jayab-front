import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { CreateAdvisorDto } from "./advisor.interface";

export class AdvisorService {
  static USER_ADVISORS_CACHEKEY = "USER_ADVISORS";

  static async createAdvisor(dto: CreateAdvisorDto) {
    try {
      const result = await apiCall<CreateAdvisorDto, unknown>("PUT", apiRoutes.PROFILE_REGISTER_ADVISORS, dto);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async userAdvisorsList(dto: { per_page: number; cursor: number }) {
    try {
      const result = await apiCall<{ per_page: number; cursor: number }, { data: unknown[] }>(
        "GET",
        apiRoutes.USER_ADVISORS,
        {
          cursor: dto.cursor,
          per_page: dto.per_page,
        }
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
}
