"use client";

import { ownerPropertiesOptions } from "../api/owner-property.options";
import { useQuery } from "@tanstack/react-query";

export const useOwnerProperties = () => useQuery(ownerPropertiesOptions());
