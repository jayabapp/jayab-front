"use client";

import { advisorPlansOptions } from "../api/advisor.options";
import { useQuery } from "@tanstack/react-query";

export const useAdvisorPlans = () => useQuery(advisorPlansOptions());
