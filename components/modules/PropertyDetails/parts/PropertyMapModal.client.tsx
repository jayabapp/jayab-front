"use client";

import type { PropertyMapModalProps } from "@/types/components/modules/property-details";
import { ModalHeaderPart } from "@elements/Modal";
import { useState } from "react";

import mapRedirectHelper from "@/helpers/map.link";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Modal from "@elements/Modal";
import dynamic from "next/dynamic";
import Link from "next/link";

const TEHRAN_CENTER = [51.37, 35.767];

const MapViewer = dynamic(
  () => import("@elements/Map").then((module) => module.MapViewer),
  {
    ssr: false,
  },
);

const PropertyMapModal = ({
  show,
  onHide,
  latitude,
  longitude,
}: PropertyMapModalProps) => {
  const [, setCenter] = useState(TEHRAN_CENTER);

  return (
    <Modal
      show={show}
      onHide={onHide}
      options={{
        containerClass:
          "mx-auto my-0 h-full md:h-auto md:my-20 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-0 md:rounded-2xl overflow-y-scroll bg-white",
      }}
    >
      <ModalHeaderPart onHide={onHide} title={_STRINGS.COORDINATES} />
      <div className="w-full bg-white rounded-md">
        <div className="w-full h-[80dvh] md:h-[60dvh] relative">
          {longitude ? (
            <MapViewer
              disableCenter
              setCenter={setCenter}
              containerClass="w-full"
              center={[Number(longitude), Number(latitude)]}
              businessMarkersData={[
                {
                  lat: Number(latitude) || 0,
                  lng: Number(longitude) || 0,
                  icon: "/assets/icons/orders/location.svg",
                },
              ]}
            />
          ) : null}
        </div>
      </div>
      <Link
        target="_blank"
        title={_STRINGS.NAVIGATE}
        href={mapRedirectHelper({
          latitude: Number(latitude),
          longitude: Number(longitude),
        })}
      >
        <Button
          width="w-full"
          containerClass="w-full p-4"
          title={_STRINGS.NAVIGATE}
        />
      </Link>
    </Modal>
  );
};

export default PropertyMapModal;
