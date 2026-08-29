import Modal from "@elements/Modal";
import { ModalHeaderPart } from "@elements/Modal";
import Button from "@elements/Button";
import mapRedirectHelper from "@/helpers/map.link";
import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";

const PropertyMapPopModal = ({ data, show, onHide }: { data: any; show: boolean; onHide: () => void | null }) => {
  const MapPlaceShower = useMemo(
    () =>
      dynamic(() => import("@/components/Map/MapPlaceShower"), {
        ssr: false,
      }),
    [],
  );
  const [center, setCenter] = useState([51.37, 35.767]);

  return (
    <Modal
      options={{
        containerClass:
          "mx-auto  my-0 mx-auto h-full md:h-auto  md:my-20 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4   rounded-0 md:rounded-2xl overflow-y-scroll bg-white ",
      }}
      onHide={onHide}
      show={show}
    >
      <ModalHeaderPart onHide={onHide} title={_STRINGS.COORDINATES} />
      <div className="w-full bg-white rounded-md">
        <div className="w-full h-[80dvh] md:h-[60dvh] relative">
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
      <Link title={_STRINGS.NAVIGATE} href={mapRedirectHelper(data)} target="_blank">
        {" "}
        <Button containerClass="w-full  p-4 " width="w-full" title={_STRINGS.NAVIGATE} />
      </Link>
    </Modal>
  );
};

export default PropertyMapPopModal;
