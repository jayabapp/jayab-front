"use client";

import { usePropertyDetails } from "@features/properties/hooks/usePropertyDetails";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import SingleProductBreadCrumb from "@/components/BreadCrumbs/SingleProductBreadCrumb";
import AnimationlessModal from "@/components/Modal/AnimationlessModal";
import ProductSkeleton from "@/components/properties/ProductSkeleton";
import Headers from "@/components/headers";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";

const ProductImagesContainer = dynamic(
  () => import("@/components/properties/imageComponents/PropertiesImagesPart"),
);
const SinglePropertyIntroduction = dynamic(
  () => import("@/components/properties/SinglePropertyIntroduction"),
);
const SinglePropertycallender = dynamic(
  () => import("@/components/properties/SinglePropertycallender"),
);
const SinglePorpertyAccards = dynamic(
  () => import("@/components/properties/SinglePropertyAccards"),
);

export default function ModalClient({
  params,
}: {
  params: { room_slug: string };
}) {
  const pathname = usePathname();
  const { property: properyData, isPending } = usePropertyDetails(
    params.room_slug,
  );

  return (
    <AnimationlessModal
      onHide={() => {}}
      show={pathname.includes("rooms/") ? true : false}
      options={{
        containerClass:
          " app-size app-text  relative  rounded-lg overflow-y-scroll  bg-white !rounded-none dark:bg-dark-900",
        parentClass: "bg-white",
      }}
    >
      <Headers />
      <div className=" !pb-48 lg:!pb-36   gap-4 justify-start items-start container grid grid-cols-1  md:grid-cols-2  !h-auto   !overflow-x-visible">
        {!!isPending ? (
          <ProductSkeleton />
        ) : !!properyData ? (
          <>
            <div className=" w-full hidden md:flex col-span-full ">
              <SingleProductBreadCrumb
                dataArray={[
                  { title: "خانه", link: "/" },
                  { title: "آگهی ها", link: "/rooms" },
                  {
                    title: properyData?.title || "",
                    link: "#",
                  },
                ]}
              />
            </div>
            <Suspense>
              <ProductImagesContainer
                productImageId={null}
                data={properyData}
              />
            </Suspense>
            <div className=" w-full col-span-full flex md:hidden ">
              {" "}
              <SingleProductBreadCrumb
                dataArray={[
                  { title: "خانه", link: "/" },
                  { title: "آگهی ها", link: "/rooms" },
                  {
                    title: properyData?.title || "",
                    link: "#",
                  },
                ]}
              />
            </div>
            <Suspense>
              <SinglePropertyIntroduction data={properyData} />
            </Suspense>
            <Suspense>
              <SinglePorpertyAccards data={properyData} />
            </Suspense>
            <Suspense>
              <SinglePropertycallender data={properyData} />
            </Suspense>
          </>
        ) : (
          <></>
        )}
      </div>
      <Footer />
    </AnimationlessModal>
  );
}
