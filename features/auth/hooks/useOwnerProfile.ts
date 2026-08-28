import { ownerProfileOptions } from "../api/auth.options";
import { useQuery } from "@tanstack/react-query";

export const useOwnerProfile = (enabled = true) =>
  useQuery(ownerProfileOptions(enabled));
