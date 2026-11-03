import RouteHubTemplate from "@templates/RouteHub";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const RouteHubPage = () => (
  <IntlNamespaces namespaces={["owner"]}>
    <RouteHubTemplate />
  </IntlNamespaces>
);

export default RouteHubPage;
