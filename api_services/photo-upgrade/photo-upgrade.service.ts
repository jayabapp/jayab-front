import { PhotoUpgradeRequestDto } from "./photo-upgrade.interface";
import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";

export class PhotoUpgradeService {
  static OWNER_PHOTO_UPGRADE_REQUESTS_CACHEKEY = "OWNER_PHOTO_UPGRADE_REQUESTS";
  static OWNER_PHOTO_UPGRADE_REQUEST_CACHEKEY = "OWNER_PHOTO_UPGRADE_REQUEST";

  static async ownerRequests(
    dto: { property_id?: number } = {},
    signal?: AbortSignal,
  ) {
    try {
      const result = await apiCall<unknown, PhotoUpgradeRequestDto[]>(
        "GET",
        apiRoutes.OWNER_PROPERTY_PHOTO_UPGRADE_REQUESTS,
        dto,
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async ownerRequest(
    dto: { id: string | number },
    signal?: AbortSignal,
  ) {
    try {
      const result = await apiCall<unknown, PhotoUpgradeRequestDto>(
        "GET",
        apiRoutes.OWNER_PROPERTY_PHOTO_UPGRADE_REQUEST(dto.id),
        undefined,
        { signal },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
}
