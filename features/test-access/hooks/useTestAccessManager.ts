"use client";

import { testAccessMembersOptions, testAccessMeOptions } from "../api/test-access.options";
import type { UpdateTestAccessMember } from "@/types/features/test-access/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TestAccessService } from "@/api_services/test-access/test-access.service";
import { testAccessKeys } from "../api/test-access.keys";
import { useState } from "react";

import Notify from "@elements/Toast";

export const useTestAccessManager = () => {
  const [mobile, setMobile] = useState("");
  const queryClient = useQueryClient();
  const meQuery = useQuery(testAccessMeOptions());
  const canManage = !!meQuery.data?.enabled && !!meQuery.data?.is_team_lead;
  const membersQuery = useQuery(testAccessMembersOptions(canManage));

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: testAccessKeys.members() });

  const createMutation = useMutation({
    mutationFn: TestAccessService.createMember,
    onSuccess: async () => {
      setMobile("");
      await refresh();
    },
  });
  const updateMutation = useMutation({
    mutationFn: TestAccessService.updateMember,
    onSuccess: refresh,
  });

  const addMember = () => {
    const normalized = mobile.trim();
    if (!/^09\d{9}$/.test(normalized)) {
      Notify({ type: "warn", body: "شماره موبایل معتبر وارد کنید." });
      return;
    }
    if (!createMutation.isPending)
      createMutation.mutate({ mobile_number: normalized });
  };

  const setMemberActive = (dto: UpdateTestAccessMember) => {
    if (!updateMutation.isPending) updateMutation.mutate(dto);
  };

  return {
    mobile,
    setMobile,
    addMember,
    setMemberActive,
    canManage,
    isCheckingAccess: meQuery.isPending,
    isLoading: membersQuery.isPending,
    isCreating: createMutation.isPending,
    updatingId: updateMutation.variables?.id,
    members: membersQuery.data ?? [],
  };
};
