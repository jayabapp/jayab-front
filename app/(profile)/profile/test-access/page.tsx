import { TestAccessManager } from "@modules/TestAccessManager";
import ProfilePageTemplate from "@templates/ProfilePage";

const TestAccessPage = () => (
  <ProfilePageTemplate containerClass="flex flex-col gap-4 py-4">
    <TestAccessManager />
  </ProfilePageTemplate>
);

export default TestAccessPage;
