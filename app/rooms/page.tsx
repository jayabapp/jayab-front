import { Suspense } from "react";

import PropertyCardSkeleton from "@/components/properties/PropertyCardSkeleton";
import deviceTypeDetector from "@/helpers/device.detector";
import Filterpage from "@/components/SinglePageComponents/Filterpage";

const Fallback = () => (
  <div className="container grid grid-cols-1 gap-2 py-4 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
    {Array.from({ length: 6 }, (_, index) => (
      <PropertyCardSkeleton key={index} />
    ))}
  </div>
);

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
