import { OwnerReservationList } from "@modules/OwnerReservations";
import ReservationsTemplate from "@templates/Reservations";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const OwnerCallLogsPage = () => (
  <IntlNamespaces namespaces={["reserve"]}>
    <ReservationsTemplate>
      <OwnerReservationList autoRefresh />
    </ReservationsTemplate>
  </IntlNamespaces>
);

export default OwnerCallLogsPage;
