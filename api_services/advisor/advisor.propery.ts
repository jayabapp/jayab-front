import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { CreateAdvisorDto } from "./advisor.interface";

export class AdvisorService {
  static async createAdvisor(dto: CreateAdvisorDto) {
    try {
      const result = await apiCall<CreateAdvisorDto, unknown>("POST", apiRoutes.USER_ADVISORS, dto);
      return result;
    } catch (e) {
      throw e;
    }
  }
}
