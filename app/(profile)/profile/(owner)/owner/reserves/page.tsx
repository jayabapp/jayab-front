import { OwnerReservationList } from "@modules/OwnerReservations";
import ReservationsTemplate from "@templates/Reservations";

const OwnerReservesPage = () => (
  <ReservationsTemplate>
    <OwnerReservationList />
  </ReservationsTemplate>
);

export default OwnerReservesPage;
