"use client";
import { useQuery } from "@tanstack/react-query";
import { advisorDetailOptions } from "../api/advisor.options";
export const useAdvisorDetails = (id?: number | string) => useQuery(advisorDetailOptions(id ?? "", Boolean(id)));
