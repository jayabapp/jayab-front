import { SubPaymentsDto } from "./user.interface";
import { GetProfileDto } from "../auth/auth.interface";
import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";

export class UserService {
  static USER_SUBSCRIPTIONS_CACHEKEY = "USER_SUBSCRIPTIONS";
  static NOTIFS_CACHEKEY = "NOTIFS";
  static NOTIFS_BADGE_CACHEKEY = "NOTIFS_BADGE";

  static async getUserSubscriptions(
    dto: {
      from?: string | number | Date;
      to?: string | number | Date;
      cursor: string | number;
      perPage?: number;
    },
    signal?: AbortSignal,
  ) {
    try {
      const result = await apiCall<
        {
          from?: string | number | Date;
          to?: string | number | Date;
          cursor: string | number;
          per_page?: number;
        },
        { data: SubPaymentsDto[] }
      >(
        "GET",
        apiRoutes.USER_SUBSCRIPTIONS,
        {
          cursor: dto.cursor,
          from: dto.from,
          to: dto.to,
          per_page: dto.perPage,
        },
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async userNotifBadge(signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, number>(
        "GET",
        apiRoutes.NOTIFS_BADGE,
        undefined,
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async userNotifs(
    dto: { cursor: number; perPage?: number },
    signal?: AbortSignal,
  ) {
    try {
      const result = await apiCall<
        { cursor: number; per_page?: number },
        {
          data: import("@/types/features/notifications/api").UserNotification[];
        }
      >(
        "GET",
        apiRoutes.NOTIFS,
        {
          cursor: dto.cursor,
          per_page: dto.perPage,
        },
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async updateProfileImage(dto: { profile_image_id: number | string }) {
    try {
      const result = await apiCall<
        { profile_image_id: number | string },
        GetProfileDto
      >("PATCH", apiRoutes.UPDATE_PROFILE_IMAGE, {
        profile_image_id: dto.profile_image_id,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }
}
