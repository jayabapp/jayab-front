import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { SubPaymentsDto } from "./user.interface";

export class UserService {
  static USER_SUBSCRIPTIONS_CACHEKEY = "USER_SUBSCRIPTIONS";

  static async getUserSubscriptions(dto: {
    form?: string | number | Date;
    to?: string | number | Date;
    cursor: string | number;
  }) {
    try {
      const result = await apiCall<
        { form?: string | number | Date; to?: string | number | Date; cursor: string | number },
        { data: SubPaymentsDto[] }
      >("GET", apiRoutes.USER_SUBSCRIPTIONS, {
        cursor: dto.cursor,
        form: dto.form,
        to: dto.to,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }
}
