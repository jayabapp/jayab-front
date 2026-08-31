import { ProfileSidebar } from "@modules/ProfileOverview";
import { ProfileLayout } from "@layouts/ProfileLayout";

import type { ProfileTemplateProps } from "@/types/components/templates/profile";

const ProfileRouteLayout = ({ children }: ProfileTemplateProps) => (
  <ProfileLayout sidebar={<ProfileSidebar />}>{children}</ProfileLayout>
);

export default ProfileRouteLayout;
