import { ProfileEditor } from "@modules/ProfileEditor";

import ProfilePageTemplate from "@templates/ProfilePage";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const ProfileEditPage = () => (
  <IntlNamespaces namespaces={["owner", "profile"]}>
    <ProfilePageTemplate>
      <ProfileEditor />
    </ProfilePageTemplate>
  </IntlNamespaces>
);

export default ProfileEditPage;
