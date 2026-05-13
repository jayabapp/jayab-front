import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import Filterpage from "@/components/SinglePageComponents/Filterpage";
import deviceTypeDetector from "@/helpers/device.detector";
import { Suspense } from "react";

function Fallback() {
  return <LottieLoading />;
}

export default async function PropertiesPage() {
  const devices = await deviceTypeDetector();
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <Filterpage devices={devices} />
      </Suspense>
    </>
  );
}
