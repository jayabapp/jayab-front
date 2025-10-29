"use client";

import AdvisorsPageHelper from "@/components/Advisor/AdvisorsPageHelper";
import { Suspense } from "react";

const AdvisorsListPage = () => {
  return (
    <Suspense>
      <AdvisorsPageHelper />
    </Suspense>
  );
};

export default AdvisorsListPage;
