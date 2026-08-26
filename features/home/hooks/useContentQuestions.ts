"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contentQuestionsOptions } from "@features/home/api/home.options";
import { HomeService } from "@/api_services/home/home.service";
import { cmsKeys } from "@features/home/api/home.keys";

import { type ContentQuestionFilters } from "@features/home/api/home.keys";

import type { SubmitContentQuestionInput } from "@/types/features/home/api";

export const useContentQuestions = (filters: ContentQuestionFilters) => {
  const query = useQuery(contentQuestionsOptions(filters));
  return {
    ...query,
    questions: query.data?.data ?? [],
    meta: query.data?.meta,
  };
};

export const useSubmitContentQuestion = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitContentQuestionInput) =>
      HomeService.SendQuestion(input),
    onSuccess: async () => {
      onSuccess?.();
      return queryClient.invalidateQueries({
        queryKey: cmsKeys.questionsRoot(),
      });
    },
  });
};
