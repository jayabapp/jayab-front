import { ProfileSidebar } from "@modules/ProfileOverview";
import { ProfileLayout } from "@layouts/ProfileLayout";

import type { ProfileTemplateProps } from "@/types/components/templates/profile";

import IntlNamespaces from "@/i18n/IntlNamespaces";

const ProfileRouteLayout = ({ children }: ProfileTemplateProps) => (
  <IntlNamespaces namespaces={["owner", "profile"]}>
    <ProfileLayout sidebar={<ProfileSidebar />}>{children}</ProfileLayout>
  </IntlNamespaces>
);

export default ProfileRouteLayout;
