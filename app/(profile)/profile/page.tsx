import { ProfileOverview } from "@modules/ProfileOverview";

import ProfileOverviewTemplate from "@templates/ProfileOverview";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const ProfilePage = () => (
  <IntlNamespaces namespaces={["owner", "profile"]}>
    <ProfileOverviewTemplate>
      <ProfileOverview />
    </ProfileOverviewTemplate>
  </IntlNamespaces>
);

export default ProfilePage;
