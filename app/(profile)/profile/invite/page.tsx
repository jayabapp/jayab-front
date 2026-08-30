import ProfilePageTemplate from "@templates/ProfilePage";
import { InvitePanel } from "@modules/Invite";

const InvitePage = () => (
  <ProfilePageTemplate containerClass="!pb-36 items-center !bg-transparent flex flex-col gap-1">
    <InvitePanel />
  </ProfilePageTemplate>
);

export default InvitePage;
