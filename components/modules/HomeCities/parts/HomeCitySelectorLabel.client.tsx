"use client";

import { useLocationLabel } from "@features/cities/hooks/useLocationLabel";

import CitySelectorLabelView from "./CitySelectorLabelView";

const HomeCitySelectorLabel = ({ modalTitle }: { modalTitle: string }) => {
  const locationLabel = useLocationLabel();
  return <CitySelectorLabelView title={locationLabel || modalTitle} />;
};

export default HomeCitySelectorLabel;
