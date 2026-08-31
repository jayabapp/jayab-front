"use client";

import { useCreatePropertyEntry } from "@features/owner-property/hooks/useCreatePropertyEntry";
import { useEffect } from "react";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";

const RouteHubLauncher = () => {
  const { start } = useCreatePropertyEntry({ loginModalCancelRoute: "/" });

  useEffect(() => {
    start();
  }, [start]);

  return (
    <div className="container w-full">
      <PropertyEditStepSkeleton variant="form" />
    </div>
  );
};

export default RouteHubLauncher;
