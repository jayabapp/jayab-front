import type { CreateTestAccessMember } from "@/types/features/test-access/api";
import type { UpdateTestAccessMember } from "@/types/features/test-access/api";
import type { TestAccessMember } from "@/types/features/test-access/api";
import type { TestAccessMe } from "@/types/features/test-access/api";

import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";

export class TestAccessService {
  static getMe(dto: { signal?: AbortSignal } = {}) {
    return apiCall<never, TestAccessMe>(
      "GET",
      apiRoutes.TEST_ACCESS_ME,
      undefined,
      { signal: dto.signal, showErrorNotification: false },
    );
  }

  static getMembers(dto: { signal?: AbortSignal } = {}) {
    return apiCall<never, TestAccessMember[]>(
      "GET",
      apiRoutes.TEST_ACCESS_MEMBERS,
      undefined,
      { signal: dto.signal },
    );
  }

  static createMember(dto: CreateTestAccessMember) {
    return apiCall<CreateTestAccessMember, TestAccessMember>(
      "POST",
      apiRoutes.TEST_ACCESS_MEMBERS,
      dto,
    );
  }

  static updateMember(dto: UpdateTestAccessMember) {
    return apiCall<{ is_active: boolean }, TestAccessMember>(
      "PATCH",
      apiRoutes.TEST_ACCESS_MEMBER(dto.id),
      { is_active: dto.is_active },
    );
  }
}
