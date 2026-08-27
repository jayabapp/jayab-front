"use client";
import { useQuery } from "@tanstack/react-query";
import { advisorPlansOptions } from "../api/advisor.options";
export const useAdvisorPlans = () => useQuery(advisorPlansOptions());
