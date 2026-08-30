"use client";

import type { PropertyDetailsModalProps } from "@/types/components/modules/property-details";
import { usePropertyDetails } from "@features/properties/hooks/usePropertyDetails";
import { AnimationlessModal } from "@elements/Modal";
import { usePathname } from "next/navigation";

import PropertyDetailsSkeleton from "./PropertyDetailsSkeleton";
import PropertyDetailsContent from "./PropertyDetailsContent";
import Headers from "@/components/headers";
import Footer from "@/components/Footer";

const ROOM_PATH = "rooms/";

const PropertyDetailsModal = ({ slug }: PropertyDetailsModalProps) => {
  const pathname = usePathname();
  const { property, isPending } = usePropertyDetails(slug);

  return (
    <AnimationlessModal
      onHide={() => {}}
      show={pathname.includes(ROOM_PATH)}
      options={{
        containerClass:
          " app-size app-text relative rounded-lg overflow-y-scroll bg-white !rounded-none ",
        parentClass: "bg-white",
      }}
    >
      <Headers />
      <div className="!pb-48 lg:!pb-36 gap-4 justify-start items-start container grid grid-cols-1 md:grid-cols-2 !h-auto !overflow-x-visible">
        {isPending ? (
          <PropertyDetailsSkeleton />
        ) : property ? (
          <PropertyDetailsContent property={property} />
        ) : null}
      </div>
      <Footer />
    </AnimationlessModal>
  );
};

export default PropertyDetailsModal;
