import ProfilePageTemplate from "@templates/ProfilePage";
import { PaymentList } from "@modules/Payments";

const MyPaymentsPage = () => (
  <ProfilePageTemplate containerClass="!pb-36 items-center !bg-transparent flex flex-col gap-1">
    <PaymentList />
  </ProfilePageTemplate>
);

export default MyPaymentsPage;
