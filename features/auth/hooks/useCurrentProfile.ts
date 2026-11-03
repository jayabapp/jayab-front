import { currentProfileOptions } from "../api/auth.options";
import { useQuery } from "@tanstack/react-query";

export const useCurrentProfile = (enabled = true) =>
  useQuery(currentProfileOptions(enabled));
