import type { ContentDto } from "@/api_services/home/home.interface";

export type SiteHeaderVariant = "page" | "modal";

export type SiteHeaderProps = {
  phone?: ContentDto;
  variant?: SiteHeaderVariant;
};

export type HeaderNavLinkProps = {
  title: string;
  route?: string;
  isLight?: boolean;
  hasBadge?: boolean;
  onSelect?: () => void;
};

export type HeaderBrandProps = {
  asLink?: boolean;
  isLight?: boolean;
  markOnly?: boolean;
  alwaysShowTitle?: boolean;
};

export type HeaderSessionBadgeProps = {
  isLogin: boolean;
  compact?: boolean;
  isLight?: boolean;
  phone?: ContentDto;
  avatar?: string | null;
  notificationCount?: number;
};

export type HeaderContactLinkProps = {
  compact?: boolean;
  isLight?: boolean;
  phone?: ContentDto;
};

export type HeaderProfileMenuProps = {
  isLight?: boolean;
  notificationCount?: number;
};

export type HeaderSearchFieldProps = {
  boxId: string;
  justIcon?: boolean;
  inputClass?: string;
  containerClass?: string;
  withCitySelector?: boolean;
};

export type HeaderDesktopNavProps = {
  boxId: string;
  isHome: boolean;
  isLogin: boolean;
  isLight: boolean;
  chatCount?: number;
  avatar?: string | null;
  advisorHasBadge?: boolean;
  notificationCount?: number;
  phone?: ContentDto;
  onCreateProperty: () => void;
};

export type HeaderMobileBarProps = {
  boxId: string;
  isHome: boolean;
  isLogin: boolean;
  phone?: ContentDto;
  isAdvisor: boolean;
  avatar?: string | null;
  notificationCount?: number;
  onRegisterAdvisor: () => void;
};
