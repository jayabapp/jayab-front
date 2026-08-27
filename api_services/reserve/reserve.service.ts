import {
  ActiveReserveDto,
  CreateReserveDto,
  ReserveListDto,
} from "./reserve.interface";
import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";

export class ReserveService {
  static RESERVE_CACHEKEY = "RESERVES";
  static OWNER_RESERVE_CACHEKEY = "OWNER_RESERVES";
  static RESERVE_ACTIVE_CACHEKEY = "RESERVE_ACTIVES";
  static OWNER_ACTIVE_RESERVE_COUNT_CACHEKEY = "OWNER_ACTIVE_RESERVE_COUNT";

  static async createReserve(dto: CreateReserveDto, idempotencyKey: string) {
    try {
      const result = await apiCall<CreateReserveDto, ReserveListDto>(
        "POST",
        apiRoutes.RESERVE,
        dto,
        {
          headers: { "Idempotency-Key": idempotencyKey },
        },
      );
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

  static async userReserves(dto: { type: string }, signal?: AbortSignal) {
    try {
      const result = await apiCall<{ type: string }, ReserveListDto[]>(
        "GET",
        apiRoutes.RESERVE,
        {
          type: dto.type,
        },
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async activeReserve(signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, ActiveReserveDto>(
        "GET",
        apiRoutes.RESERVE_ACTIVE,
        undefined,
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async ownerReserves(
    dto: { cursor: number; type?: string },
    signal?: AbortSignal,
  ) {
    try {
      const result = await apiCall<
        { cursor: number; per_page: number; type?: string },
        { data: ReserveListDto[] }
      >(
        "GET",
        apiRoutes.OWNER_RESERVE,
        {
          cursor: dto.cursor,
          per_page: 20,
          ...(dto.type ? { type: dto.type } : {}),
        },
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async ownerMobileClick(dto: { id: string | number }) {
    try {
      const result = await apiCall<unknown, any>(
        "POST",
        apiRoutes.OWNER_CALL_RESERVE_REQUEST(dto?.id),
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async ownerActiveReserveCount(signal?: AbortSignal) {
    try {
      const result = await apiCall<unknown, number>(
        "GET",
        apiRoutes.OWNER_ACTIVE_RESERVE_COUNT,
        undefined,
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
}
