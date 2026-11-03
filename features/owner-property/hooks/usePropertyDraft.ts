"use client";

import { propertyDraftOptions } from "../api/owner-property.options";
import { useQuery } from "@tanstack/react-query";

export const usePropertyDraft = (id: string | number) =>
  useQuery(propertyDraftOptions(id));
