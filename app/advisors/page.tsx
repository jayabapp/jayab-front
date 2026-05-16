import AdvisorsPageHelper from "@/components/Advisor/AdvisorsPageHelper";
import deviceTypeDetector from "@/helpers/device.detector";
import { Suspense } from "react";

const AdvisorsListPage = async () => {
  const devices = await deviceTypeDetector();
  return (
    <Suspense>
      <AdvisorsPageHelper devices={devices} />
    </Suspense>
  );
};

export default AdvisorsListPage;
