"use client";

import { userBookmarksOptions } from "@features/user/api/user.options";
import { resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

export const useUserBookmarks = () =>
  useQuery(userBookmarksOptions(resolveLocale(useLocale())));
