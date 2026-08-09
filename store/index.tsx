import { GetProfileDto } from "@/api_services/auth/auth.interface";
import { persist } from "zustand/middleware";
import { Moment } from "moment-jalaali";
import { create } from "zustand";

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
      name: "zustand-auth-storage",
      partialize: (state) => ({
        isAdminSso: state.isAdminSso,
      }),
    },
  ),
);

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

export type ParamStore = {
  isDark: boolean;
  likes: number[];
  isAdvisor: boolean;
  loginModal: boolean;
  bookmarks: number[];
  getBackHome: boolean;
  sideBarStatus: boolean;
  topHeaderVisible: boolean;
  installPrompt: any | null;
  showInstallPrompt: boolean;
  loginModalCancelRoute: string;
  owmerActiveReservesSocket: any;
  owmerActiveReservesCount: number;
  notificationsCount: number | null;
  ssrLikedProducts?: { [key: string]: number | string };
  setOwmerActiveReservesCount: (a: number | null) => void;
  setSsrLikedProducts: (s: { [key: string]: number | string }) => void;
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
  setOwmerActiveReservesCount: (values: any) =>
    set(() => ({ owmerActiveReservesCount: values })),
  owmerActiveReservesSocket: null,
  notificationsCount: 0,
}));

export type InitStore = {
  userInfo: GetProfileDto | null;
};

export const useStoreInit = create<InitStore>(() => ({
  userInfo: null,
}));

export type LocationsStore = {
  locationsData: { [key: string]: any | null };
};

export const useCitiesStore = create<LocationsStore>(() => ({
  locationsData: {},
}));

export type ThemeStore = {
  logo: any | null;
  color: any | null;
  title: any | null;
  splash: any | null;
  off_days: any[] | null;
  background_color: any | null;
};

export type AuthStores = {
  adminAccess: any[];
  adminInfo: any | null;
  setAdminInfo: (data: any) => void;
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
  chatProduct: any;
  usersStatus: any;
  chatsPageData: any;
  deletedMessage: any;
  chatNotification: any;
};

export const useChatStore = create<ChatStore>(() => ({
  isTyping: null,
  chatReply: null,
  chatDelete: null,
  usersStatus: null,
  chatProduct: null,
  chatsPageData: null,
  deletedMessage: null,
  chatNotification: null,
}));
