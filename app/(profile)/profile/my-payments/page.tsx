import { PaymentList } from "@modules/Payments";

import ProfilePageTemplate from "@templates/ProfilePage";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const MyPaymentsPage = () => (
  <IntlNamespaces namespaces={["profile"]}>
    <ProfilePageTemplate containerClass="!pb-36 items-center !bg-transparent flex flex-col gap-1">
      <PaymentList />
    </ProfilePageTemplate>
  </IntlNamespaces>
);

export default MyPaymentsPage;
