import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { ActiveReserveDto, CreateReserveDto, ReserveListDto } from "./reserve.interface";

export class ReserveService {
  static RESERVE_CACHEKEY = "RESERVES";
  static OWNER_RESERVE_CACHEKEY = "OWNER_RESERVES";
  static RESERVE_ACTIVE_CACHEKEY = "RESERVE_ACTIVES";
  static OWNER_ACTIVE_RESERVE_COUNT_CACHEKEY = "OWNER_ACTIVE_RESERVE_COUNT";

  static async createReserve(dto: CreateReserveDto) {
    try {
      const result = await apiCall<unknown, ReserveListDto>("POST", apiRoutes.RESERVE, dto);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async cancelReserve(dto: { propertyReserveId: string | number }) {
    try {
      const result = await apiCall<{ propertyReserveId: string | number }, any>(
        "PATCH",
        apiRoutes.CANCEL_RESERVE(dto?.propertyReserveId),
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async userReserves(dto: { type: string }) {
    try {
      const result = await apiCall<{ type: string }, ReserveListDto[]>("GET", apiRoutes.RESERVE, {
        type: dto.type,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async activeReserve() {
    try {
      const result = await apiCall<unknown, ActiveReserveDto>("GET", apiRoutes.RESERVE_ACTIVE);
      return result;
    } catch (e) {
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                    OWNER                                   */
  /* -------------------------------------------------------------------------- */
  static async ownerReserves(dto: { cursor: number }) {
    try {
      const result = await apiCall<{ cursor: number; per_page: number }, { data: any[] }>(
        "GET",
        apiRoutes.OWNER_RESERVE,
        {
          cursor: dto.cursor,
          per_page: 20,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async ownerMobileClick(dto: { id: string | number }) {
    try {
      const result = await apiCall<unknown, any>("POST", apiRoutes.OWNER_CALL_RESERVE_REQUEST(dto?.id));
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async ownerActiveReserveCount() {
    try {
      const result = await apiCall<unknown, any>("GET", apiRoutes.OWNER_ACTIVE_RESERVE_COUNT);
      return result;
    } catch (e) {
      throw e;
    }
  }
}
