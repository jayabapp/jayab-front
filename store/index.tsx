import { GetProfileDto } from "@/api_services/auth/auth.interface";
import { Moment } from "moment-jalaali";
import { create } from "zustand";
import { persist } from "zustand/middleware";
/* -------------------------------------------------------------------------- */
/* AUTH */
/* -------------------------------------------------------------------------- */

export type AuthStore = {
  isLogin: boolean;

  isAdminSso: boolean;
  authCodeExpire: Moment | string | number | null;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLogin: false,
      isAdminSso: false,
      authCodeExpire: null,
    }),
    {
      name: "zustand-auth-storage", // localStorage key
      partialize: (state) => ({
        isAdminSso: state.isAdminSso, // only this key is persisted
      }),
    },
  ),
);
/* -------------------------------------------------------------------------- */
/*                                AUTH QUERIES                                */
/* -------------------------------------------------------------------------- */
export type AuthQueriesStore = {
  auth_queries: any | null;
};
export const useAuthQueriesStore = create<AuthQueriesStore, any>(
  persist(
    (set, get) => ({
      auth_queries: "",
    }),
    {
      name: "auth-queries-storage",
    },
  ),
);

/* -------------------------------------------------------------------------- */
/* PARAMS */
/* -------------------------------------------------------------------------- */
export type ParamStore = {
  isDark: boolean;
  isAdvisor: boolean;
  loginModalCancelRoute: string;
  installPrompt: any | null;
  showInstallPrompt: boolean;
  sideBarStatus: boolean;
  loginModal: boolean;
  topHeaderVisible: boolean;
  getBackHome: boolean;
  likes: number[];
  bookmarks: number[];
  ssrLikedProducts?: { [key: string]: number | string };
  setSsrLikedProducts: (s: { [key: string]: number | string }) => void;
  owmerActiveReservesCount: number;
  setOwmerActiveReservesCount: (a: number | null) => void;
  owmerActiveReservesSocket: any;
};

export const useStoreParams = create<ParamStore>((set) => ({
  isDark: false,
  topHeaderVisible: true,
  showInstallPrompt: false,
  installPrompt: null,
  sideBarStatus: false,
  loginModal: false,
  loginModalCancelRoute: "",
  isAdvisor: false,
  getBackHome: true,
  likes: [],
  bookmarks: [],
  ssrLikedProducts: {},
  setSsrLikedProducts: (obj) => set(() => ({ ssrLikedProducts: obj })),
  owmerActiveReservesCount: 0,
  setOwmerActiveReservesCount: (values: any) => set(() => ({ owmerActiveReservesCount: values })),
  owmerActiveReservesSocket: null,
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
/* SELECTED CITIES */
/* -------------------------------------------------------------------------- */

export type LocationsStore = {
  locationsData: { [key: string]: any | null };
};

export const useCitiesStore = create<LocationsStore>(() => ({
  locationsData: {},
}));

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
    },
  ),
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

/* -------------------------------------------------------------------------- */
/*                                    CHAT                                    */
/* -------------------------------------------------------------------------- */
export type ChatStore = {
  isTyping: any;
  chatReply: any;
  chatDelete: any;
  usersStatus: any;
  deletedMessage: any;
  chatNotification: any;
  chatProduct: any;
  chatsPageData: any;
};

export const useChatStore = create<ChatStore>(() => ({
  isTyping: null,
  chatReply: null,
  chatDelete: null,
  deletedMessage: null,
  usersStatus: null,
  chatNotification: null,
  chatProduct: null,
  chatsPageData: null,
}));
