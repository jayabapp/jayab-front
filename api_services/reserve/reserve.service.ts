import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { CreateReserveDto, ReserveListDto } from "./reserve.interface";

export class ReserveService {
  static RESERVE_CACHEKEY = "RESERVES";

  static async createReserve(dto: CreateReserveDto) {
    try {
      const result = await apiCall<unknown, any>("POST", apiRoutes.RESERVE, dto);
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

  static async userReserves(dto: { cursor: number }) {
    try {
      const result = await apiCall<{ cursor: number; per_page: number }, { data: ReserveListDto[] }>(
        "GET",
        apiRoutes.RESERVE,
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
}
