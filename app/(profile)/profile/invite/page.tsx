import { InvitePanel } from "@modules/Invite";

import ProfilePageTemplate from "@templates/ProfilePage";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const InvitePage = () => (
  <IntlNamespaces namespaces={["profile"]}>
    <ProfilePageTemplate containerClass="!pb-36 items-center !bg-transparent flex flex-col gap-1">
      <InvitePanel />
    </ProfilePageTemplate>
  </IntlNamespaces>
);

export default InvitePage;
