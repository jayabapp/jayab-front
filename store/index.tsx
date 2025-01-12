import { GetProfileDto } from "@/api_services/auth/auth.interface";
import { Moment } from "moment-jalaali";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
/* -------------------------------------------------------------------------- */
/* AUTH */
/* -------------------------------------------------------------------------- */

export type AuthStore = {
  isLogin: boolean;
  authCodeExpire: Moment | string | number | null;
};

export const useAuthStore = create<AuthStore>(() => ({
  isLogin: false,
  authCodeExpire: null,
}));

/* -------------------------------------------------------------------------- */
/* PARAMS */
/* -------------------------------------------------------------------------- */
export type ParamStore = {
  isDark: boolean;
  installPrompt: any | null;
  showInstallPrompt: boolean;
  sideBarStatus: boolean;
};

export const useStoreParams = create<ParamStore>(() => ({
  isDark: false,
  showInstallPrompt: false,
  installPrompt: null,
  sideBarStatus: false,
}));

/* -------------------------------------------------------------------------- */
/* INIT */
/* -------------------------------------------------------------------------- */
export type InitStore = {
  userInfo: GetProfileDto | null;
};

export const useStoreInit = create<InitStore>(() => ({
  userInfo: null,
}));

/* -------------------------------------------------------------------------- */
/* THEME */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* THEME */
/* -------------------------------------------------------------------------- */
export type ThemeStore = {
  color: any | null;
  background_color: any | null;

  logo: any | null;
  off_days: any[] | null;
  splash: any | null;
  title: any | null;
};
export type AuthStores = {
  adminInfo: any | null;
  setAdminInfo: (data: any) => void;
  adminAccess: any[];
  setAdminAccess: (data: any) => void;
};

export const useStoreTheme = create<ThemeStore, any>(
  persist(
    (set, get) => ({
      color: "#936059",
      background_color: "#936059",

      logo: null,
      off_days: null,
      splash: null,
      title: "جایاب",
    }),
    {
      name: "theme-storage",
    }
  )
);
/* -------------------------------------------------------------------------- */
/* SOCKET */
/* -------------------------------------------------------------------------- */
export type SocketStore = {
  socket: any;
  connecting: boolean;
  notification: any;
};

export const useStoreSocket = create<SocketStore>(() => ({
  socket: null,
  connecting: false,
  notification: null,
}));

/* -------------------------------------------------------------------------- */
/* USE_QUERY */
/* -------------------------------------------------------------------------- */
export type QueryStore = {
  client: any;
};

export const useStoreQuery = create<QueryStore>(() => ({
  client: null,
}));

export type ChatStore = {
  isTyping: any;
  chatReply: any;
  chatDelete: any;
  usersStatus: any;
  deletedMessage: any;
  chatNotification: any;
  chatProduct: any;
};

export const useChatStore = create<ChatStore>(() => ({
  isTyping: null,
  chatReply: null,
  chatDelete: null,
  deletedMessage: null,
  usersStatus: null,
  chatNotification: null,
  chatProduct: null,
}));
