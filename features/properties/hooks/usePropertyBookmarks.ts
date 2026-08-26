"use client";

import { propertyBookmarksOptions } from "@features/properties/api/property.options";
import { useQuery } from "@tanstack/react-query";

export const usePropertyBookmarks = () => useQuery(propertyBookmarksOptions());
