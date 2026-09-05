"use client";

import type { ContactMapProps } from "@/types/components/modules/contact-us";
import { useState } from "react";

import Skeleton from "@elements/Skeleton/Skeleton";
import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@elements/Map").then((module) => module.MapViewer),
  {
    loading: () => <Skeleton className="size-full rounded-md" />,
    ssr: false,
  },
);

const ContactMap = ({ latitude, longitude }: ContactMapProps) => {
  const [, setCenter] = useState([longitude, latitude]);

  return (
    <Map
      disableCenter
      center={[longitude, latitude]}
      setCenter={setCenter}
      businessMarkersData={[
        {
          lat: latitude,
          lng: longitude,
          icon: "/assets/icons/orders/location.svg",
        },
      ]}
    />
  );
};

export default ContactMap;
