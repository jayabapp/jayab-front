import { authInitOptions } from "../api/auth.options";
import { useQuery } from "@tanstack/react-query";

export const useAuthInit = (enabled = true) =>
  useQuery(authInitOptions(enabled));
