"use client";

import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";

import type { UseMutationOptions } from "@tanstack/react-query";

type AttachmentUploadInput = Parameters<typeof AuthService.UploadUsersImage>[0];
type AttachmentUploadResult = Awaited<ReturnType<typeof AuthService.UploadUsersImage>>;

export const useAttachmentUpload = (
  options?: Omit<
    UseMutationOptions<AttachmentUploadResult, Error, AttachmentUploadInput>,
    "mutationFn"
  >,
) =>
  useMutation({
    ...options,
    mutationFn: AuthService.UploadUsersImage,
  });
