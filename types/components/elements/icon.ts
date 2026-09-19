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
  | "clock"
  | "copy"
  | "heart"
  | "home"
  | "images"
  | "info"
  | "map-pin"
  | "minus"
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
