import { OwnerReservationList } from "@modules/OwnerReservations";
import ReservationsTemplate from "@templates/Reservations";

const OwnerCallLogsPage = () => (
  <ReservationsTemplate>
    <OwnerReservationList autoRefresh />
  </ReservationsTemplate>
);

export default OwnerCallLogsPage;
