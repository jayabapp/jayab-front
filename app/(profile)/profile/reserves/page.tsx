import { GuestReservationList } from "@modules/GuestReservations";

import ReservationsTemplate from "@templates/Reservations";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const GuestReservesPage = () => (
  <IntlNamespaces namespaces={["reserve"]}>
    <ReservationsTemplate>
      <GuestReservationList />
    </ReservationsTemplate>
  </IntlNamespaces>
);

export default GuestReservesPage;
