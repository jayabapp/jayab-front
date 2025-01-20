import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import Filterpage from "@/components/SinglePageComponents/Filterpage";
import { Suspense } from "react";

function Fallback() {
  return <LottieLoading />;
}

export default function PropertiesPage() {
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <Filterpage />
      </Suspense>
    </>
  );
}
