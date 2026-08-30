"use client";

import { userBookmarksOptions } from "@features/user/api/user.options";
import { useQuery } from "@tanstack/react-query";

export const useUserBookmarks = () => useQuery(userBookmarksOptions());
