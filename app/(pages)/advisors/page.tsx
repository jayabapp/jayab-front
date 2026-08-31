import { AdvisorList } from "@modules/AdvisorList";
import { Suspense } from "react";

import deviceTypeDetector from "@/helpers/device.detector";
import AdvisorsTemplate from "@templates/Advisors";

const AdvisorsPage = async () => {
  const devices = await deviceTypeDetector();

  return (
    <AdvisorsTemplate>
      <Suspense>
        <AdvisorList devices={devices} />
      </Suspense>
    </AdvisorsTemplate>
  );
};

export default AdvisorsPage;
