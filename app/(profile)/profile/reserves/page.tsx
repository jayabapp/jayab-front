import { GuestReservationList } from "@modules/GuestReservations";

import ReservationsTemplate from "@templates/Reservations";

const GuestReservesPage = () => (
  <ReservationsTemplate>
    <GuestReservationList />
  </ReservationsTemplate>
);

export default GuestReservesPage;
