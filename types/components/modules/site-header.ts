export type SiteHeaderVariant = "page" | "modal";

export type SiteHeaderProps = {
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
  isLight?: boolean;
  asLink?: boolean;
};

export type HeaderSessionBadgeProps = {
  isLogin: boolean;
  isLight?: boolean;
  avatar?: string | null;
  notificationCount?: number;
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
  onCreateProperty: () => void;
};

export type HeaderMobileBarProps = {
  boxId: string;
  isHome: boolean;
  isLogin: boolean;
  isLight: boolean;
  isAdvisor: boolean;
  avatar?: string | null;
  notificationCount?: number;
  onRegisterAdvisor: () => void;
};
