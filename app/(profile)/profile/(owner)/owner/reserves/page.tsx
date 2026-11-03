import { OwnerReservationList } from "@modules/OwnerReservations";
import ReservationsTemplate from "@templates/Reservations";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const OwnerReservesPage = () => (
  <IntlNamespaces namespaces={["reserve"]}>
    <ReservationsTemplate>
      <OwnerReservationList />
    </ReservationsTemplate>
  </IntlNamespaces>
);

export default OwnerReservesPage;
