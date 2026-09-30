export type IconName =
  | "bath"
  | "bed"
  | "bookmark"
  | "broom"
  | "calendar"
  | "chat"
  | "check"
  | "chevron-down"
  | "chevron-left"
  | "cigarette"
  | "clock"
  | "copy"
  | "expand"
  | "eye"
  | "eye-off"
  | "heart"
  | "home"
  | "images"
  | "info"
  | "map-pin"
  | "minus"
  | "party"
  | "paw"
  | "phone"
  | "plus"
  | "pool"
  | "ruler"
  | "share"
  | "shield"
  | "sms"
  | "sparkles"
  | "star"
  | "toilet"
  | "user-plus"
  | "users"
  | "x";

export type IconProps = {
  className?: string;
  name: IconName;
  size?: 16 | 20 | 24 | 32;
};
