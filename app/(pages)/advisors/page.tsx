import { AdvisorList } from "@modules/AdvisorList";
import { Suspense } from "react";

import deviceTypeDetector from "@/helpers/device.detector";
import AdvisorsTemplate from "@templates/Advisors";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const AdvisorsPage = async () => {
  const devices = await deviceTypeDetector();

  return (
    <IntlNamespaces namespaces={["advisor", "content"]}>
      <AdvisorsTemplate>
        <Suspense>
          <AdvisorList devices={devices} />
        </Suspense>
      </AdvisorsTemplate>
    </IntlNamespaces>
  );
};

export default AdvisorsPage;
