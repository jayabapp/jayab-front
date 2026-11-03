// Imported from the skeleton file rather than the module barrel on purpose: a
// route loading boundary is evaluated during prerender, and going through the
// index would drag the module's client islands and feature hooks into that
// graph for the sake of one static component.
import NotificationCardSkeleton from "@modules/Notifications/NotificationCardSkeleton";

const CARD_COUNT = 6;

const NotificationsLoading = () => (
  <main
    aria-busy="true"
    className="route-enter container transition-all duration-500 ease-in-out"
  >
    <div className="flex flex-col gap-3 py-4">
      {Array.from({ length: CARD_COUNT }, (_, index) => (
        <NotificationCardSkeleton key={index} />
      ))}
    </div>
  </main>
);

export default NotificationsLoading;
