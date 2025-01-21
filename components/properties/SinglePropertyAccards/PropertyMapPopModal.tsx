import Modal from "@/components/Modal";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";

const PropertyMapPopModal = ({ data, show, onHide }: { data: any; show: boolean; onHide: () => void | null }) => {
  const MapPlaceShower = useMemo(
    () =>
      dynamic(() => import("@/components/Map/MapPlaceShower"), {
        ssr: false,
      }),
    []
  );
  const [center, setCenter] = useState([51.37, 35.767]);

  return (
    <Modal
      options={{
        containerClass:
          "mx-auto  my-0 mx-auto h-full md:h-auto  md:my-20 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-2xl overflow-y-scroll bg-white dark:bg-zinc-900",
      }}
      onHide={onHide}
      show={show}
    >
      <ModalHeaderPart onHide={onHide} title={_STRINGS.COORDINATES} />
      <div className="w-full bg-white rounded-md">
        <div className="w-full h-[85dvh] md:h-[60dvh] relative">
          {data && data?.longitude && (
            <MapPlaceShower
              containerClass="w-full"
              disableCenter={true}
              center={[Number(data?.longitude), Number(data?.latitude)]}
              setCenter={setCenter}
              businessMarkersData={[
                {
                  lat: Number(data?.latitude) || 0,
                  lng: Number(data?.longitude) || 0,
                  icon: "/assets/icons/orders/location.svg",
                },
              ]}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PropertyMapPopModal;
