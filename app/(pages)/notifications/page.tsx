import { NotificationList } from "@modules/Notifications";
import NotificationsTemplate from "@templates/Notifications";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const NotificationsPage = () => (
  <IntlNamespaces namespaces={["profile"]}>
    <NotificationsTemplate>
      <NotificationList />
    </NotificationsTemplate>
  </IntlNamespaces>
);

export default NotificationsPage;
