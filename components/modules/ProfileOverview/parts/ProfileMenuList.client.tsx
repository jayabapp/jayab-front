"use client";

import type { ProfileMenuListProps } from "@/types/components/modules/profile";

import ProfileMenuRow from "./ProfileMenuRow.client";

const ProfileMenuList = ({ entries, compact }: ProfileMenuListProps) => (
  <>
    {entries.map((entry) => (
      <ProfileMenuRow
        entry={entry}
        compact={compact}
        key={`profileMenu${entry.id}${entry.route}`}
      />
    ))}
  </>
);

export default ProfileMenuList;
