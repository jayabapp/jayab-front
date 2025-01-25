import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { SubPaymentsDto } from "./user.interface";

export class UserService {
  static USER_SUBSCRIPTIONS_CACHEKEY = "USER_SUBSCRIPTIONS";
  static NOTIFS_CACHEKEY = "NOTIFS";
  static NOTIFS_BADGE_CACHEKEY = "NOTIFS_BADGE";

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

  static async userNotifBadge() {
    try {
      const result = await apiCall<unknown, number>("GET", apiRoutes.NOTIFS_BADGE);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async userNotifs(dto: { cursor: number }) {
    try {
      const result = await apiCall<{ cursor: number }, { data: any[] }>("GET", apiRoutes.NOTIFS, {
        cursor: dto.cursor,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }
}
