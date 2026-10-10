"use client";

import { getUserAvatarUrl } from "@features/user/mappers/user-image.mapper";
import { useListSeparator } from "@hooks/useListSeparator";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { ProfileWelcomeProps } from "@/types/components/modules/profile";

import ProfileQuickAccess from "./ProfileQuickAccess.client";
import ProfileCompletion from "./ProfileCompletion.client";
import ProfileStats from "./ProfileStats.client";

const ProfileWelcome = ({ profile, entries, isLogin }: ProfileWelcomeProps) => {
  const t = useTranslations("profile");
  const sep = useListSeparator();

  const displayName = profile?.full_name?.trim();
  const initial = displayName ? displayName.slice(0, 1) : t("unknownInitial");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pt-4">
      <div className="glass-surface flex items-center gap-4 rounded-28 p-6">
        {profile?.profile_image ? (
          <ContentImage
            alt=""
            width={64}
            height={64}
            src={getUserAvatarUrl(profile.profile_image)}
            className="size-16 shrink-0 rounded-full border-2 border-white object-cover shadow-glass-sm"
          />
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-bl from-brand-400 to-brand-700 text-2xl font-bold text-white shadow-glass-btn">
            {initial}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold text-neutral-900">
            {t("profileGreeting")}
            {displayName ? ` ${displayName}` : ""}
            {sep}
            {t("profileWelcomeBack")}
          </p>
          <p className="text-sm text-neutral-600">
            {t("profileDashboardHint")}
          </p>
        </div>
      </div>

      <ProfileCompletion profile={profile} />
      <ProfileStats profile={profile} isLogin={isLogin} />
      <ProfileQuickAccess entries={entries} />
    </div>
  );
};

export default ProfileWelcome;
