import type { ReservationsTemplateProps } from "@/types/components/templates/reservations";

const ReservationsTemplate = ({ children }: ReservationsTemplateProps) => (
  <main
    id="homeParent"
    className="profile-container flex flex-col gap-4 transition-all duration-500 ease-in-out"
  >
    {children}
  </main>
);

export default ReservationsTemplate;
