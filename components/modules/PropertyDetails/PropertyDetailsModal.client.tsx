"use client";

import type { PropertyDetailsModalProps } from "@/types/components/modules/property-details";
import { usePropertyDetails } from "@features/properties/hooks/usePropertyDetails";
import { usePathname, useRouter } from "next/navigation";
import { AnimationlessModal } from "@elements/Modal";

import PropertyDetailsSkeleton from "./PropertyDetailsSkeleton";
import PropertyDetailsContent from "./PropertyDetailsContent";

const ROOM_PATH = "rooms/";

const PropertyDetailsModal = ({
  slug,
  header,
  footer,
}: PropertyDetailsModalProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { property, isPending } = usePropertyDetails(slug);

  return (
    <AnimationlessModal
      onHide={() => router.back()}
      show={pathname.includes(ROOM_PATH)}
      options={{
        containerClass:
          " app-size app-text relative rounded-lg overflow-y-scroll bg-white !rounded-none ",
        parentClass: "bg-white",
      }}
    >
      {header}
      <div className="!pb-48 lg:!pb-36 gap-4 justify-start items-start container grid grid-cols-1 md:grid-cols-2 !h-auto !overflow-x-visible">
        {isPending ? (
          <PropertyDetailsSkeleton />
        ) : property ? (
          <PropertyDetailsContent property={property} />
        ) : null}
      </div>
      {footer}
    </AnimationlessModal>
  );
};

export default PropertyDetailsModal;
