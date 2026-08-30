import { ProfileSidebar } from "@modules/ProfileOverview";
import { Suspense } from "react";

import type { ProfileTemplateProps } from "@/types/components/templates/profile";

const ProfileLayout = ({ children }: ProfileTemplateProps) => (
  <div className="profile-grid-part grid-cols-12 w-full px-3 md:px-3 lg:px-4 2xl:px-[10%] mx-auto gap-3 h-full">
    <div className="hidden lg:flex col-span-3 overflow-scroll rounded-10 text-center h-full profile-py-28">
      <ProfileSidebar />
    </div>

    <div
      style={{ gridColumn: "span 9 / span 9" }}
      className="col-span-9 w-full mx-auto h-full mb-16 profile-py-28-md"
    >
      <Suspense>{children}</Suspense>
    </div>
  </div>
);

export default ProfileLayout;
