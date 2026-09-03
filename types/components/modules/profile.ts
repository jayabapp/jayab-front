import type { GetProfileDto, SubPaymentsDto } from "@/types/features/user";
import type { ProfileMenuEntry } from "@/types/features/user";
import type { UserNotification } from "@/types/features/notifications/api";
import type { ReactNode } from "react";

export type { GetProfileDto, ProfileMenuEntry, SubPaymentsDto };

export type ProfileIdentityProps = {
  profile?: GetProfileDto;
};

export type ProfileSessionActionProps = {
  isLogin: boolean;
};

export type ProfileMenuListProps = {
  compact?: boolean;
  entries: ProfileMenuEntry[];
};

export type ProfileMenuRowProps = {
  compact?: boolean;
  entry: ProfileMenuEntry;
};

export type ProfileQuickAccessProps = {
  entries: ProfileMenuEntry[];
  /** How many shortcuts to surface; the rest stay in the menu. */
  limit?: number;
};

export type ProfileWelcomeProps = {
  profile?: GetProfileDto;
  entries: ProfileMenuEntry[];
  isLogin: boolean;
};

export type ProfileStatsProps = {
  profile?: GetProfileDto;
  isLogin: boolean;
};

export type ProfileCompletionProps = {
  profile?: GetProfileDto;
};

export type PaymentCardProps = {
  payment: SubPaymentsDto;
};

export type PaymentRangeFilterProps = {
  query: Record<string, string>;
};

export type NotificationCardProps = {
  notification: UserNotification;
};

export type NotificationSkeletonGridProps = {
  count?: number;
};

export type ProfileSectionProps = {
  children: ReactNode;
};
