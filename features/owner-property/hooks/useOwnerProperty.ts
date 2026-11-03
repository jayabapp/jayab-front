"use client";

import { ownerPropertyOptions } from "../api/owner-property.options";
import { useQuery } from "@tanstack/react-query";

export const useOwnerProperty = (id: string | number) =>
  useQuery(ownerPropertyOptions(id));
