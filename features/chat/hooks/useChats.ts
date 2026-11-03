import { chatsOptions } from "../api/chat.options";
import { useQuery } from "@tanstack/react-query";

export const useChats = (enabled = true) =>
  useQuery({ ...chatsOptions(), enabled });
