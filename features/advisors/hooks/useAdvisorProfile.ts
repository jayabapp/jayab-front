"use client";
import { useQuery } from "@tanstack/react-query";
import { advisorProfileOptions } from "../api/advisor.options";
export const useAdvisorProfile = (enabled = true) => useQuery(advisorProfileOptions(enabled));
