"use client";

import { usePropertyDetails } from "@features/properties/hooks/usePropertyDetails";
import { usePathname } from "next/navigation";

import SinglePropertyIntroduction from "@/components/properties/SinglePropertyIntroduction";
import SinglePropertycallender from "@/components/properties/SinglePropertycallender";
import ProductImagesContainer from "@/components/properties/imageComponents/PropertiesImagesPart";
import SinglePorpertyAccards from "@/components/properties/SinglePropertyAccards";
import ProductSkeleton from "@/components/properties/ProductSkeleton";
import Headers from "@/components/headers";
import Modal from "@elements/Modal";

const PropertiesModal = ({ room_slug }: { room_slug: string }) => {
  const pathname = usePathname();

  const { property: properyData, isPending } = usePropertyDetails(room_slug);

  return (
    <Modal
      onHide={() => {}}
      show={pathname.includes("rooms/") ? true : false}
      options={{
        containerClass:
          " app-size app-text  relative  rounded-lg overflow-y-scroll  bg-white !rounded-none ",
        parentClass: "bg-white",
      }}
    >
      <Headers />
      <div className=" !pb-48 lg:!pb-36   gap-4 justify-start items-start container grid grid-cols-1  md:grid-cols-2  !h-auto   !overflow-x-visible">
        {!!isPending ? (
          <ProductSkeleton />
        ) : !!properyData ? (
          <>
            <ProductImagesContainer productImageId={null} data={properyData} />
            <SinglePropertyIntroduction data={properyData} />
            <SinglePorpertyAccards data={properyData} />
            <SinglePropertycallender data={properyData} />
          </>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
};

export default PropertiesModal;
