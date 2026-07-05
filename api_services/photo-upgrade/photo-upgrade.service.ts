import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { PhotoUpgradeRequestDto } from "./photo-upgrade.interface";

export class PhotoUpgradeService {
  static OWNER_PHOTO_UPGRADE_REQUESTS_CACHEKEY = "OWNER_PHOTO_UPGRADE_REQUESTS";
  static OWNER_PHOTO_UPGRADE_REQUEST_CACHEKEY = "OWNER_PHOTO_UPGRADE_REQUEST";

  static async ownerRequests() {
    try {
      const result = await apiCall<unknown, PhotoUpgradeRequestDto[]>(
        "GET",
        apiRoutes.OWNER_PROPERTY_PHOTO_UPGRADE_REQUESTS,
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async ownerRequest(dto: { id: string | number }) {
    try {
      const result = await apiCall<unknown, PhotoUpgradeRequestDto>(
        "GET",
        apiRoutes.OWNER_PROPERTY_PHOTO_UPGRADE_REQUEST(dto.id),
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
}
