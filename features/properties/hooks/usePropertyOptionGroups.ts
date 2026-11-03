"use client";

import { propertyOptionGroupsOptions } from "@features/properties/api/property.options";
import { useQuery } from "@tanstack/react-query";

export const usePropertyOptionGroups = (groups?: readonly string[]) =>
  useQuery(propertyOptionGroupsOptions(groups));
