"use client";

import { PropertyService } from "@/api_services/property/property.service";
import Headers from "@/components/headers";
import AnimationlessModal from "@/components/Modal/AnimationlessModal";
import dynamic from "next/dynamic";

import ProductSkeleton from "@/components/properties/ProductSkeleton";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import SingleProductBreadCrumb from "@/components/BreadCrumbs/SingleProductBreadCrumb";
import Footer from "@/components/Footer";
import { Suspense } from "react";

const ProductImagesContainer = dynamic(() => import("@/components/properties/imageComponents/PropertiesImagesPart"));
const SinglePropertyIntroduction = dynamic(() => import("@/components/properties/SinglePropertyIntroduction"));
const SinglePropertycallender = dynamic(() => import("@/components/properties/SinglePropertycallender"));
const SinglePorpertyAccards = dynamic(() => import("@/components/properties/SinglePropertyAccards"));

export default function ModalClient({ params }: { params: { room_slug: string } }) {
  const incomingParams = params;
  const pathname = usePathname();

  const { data: properyData, isPending } = useQuery({
    queryKey: [PropertyService?.GET_SINGLEPROPERTY_SlUG_CACHEKEY, incomingParams?.room_slug],
    queryFn: () => {
      if (incomingParams?.room_slug)
        return PropertyService?.GetSinglePropertyWithSlug({ Property_slug: incomingParams?.room_slug });
      else {
        return null;
      }
    },
  });

  //   useEffect(() => {
  //     if (!properyData) return;

  //     const prevTitle = document.title;
  //     const descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  //     const prevDesc = descMeta?.getAttribute("content") || "";

  //     document.title = properyData?.title || prevTitle;

  //     let meta = descMeta;
  //     if (!meta) {
  //       meta = document.createElement("meta");
  //       meta.setAttribute("name", "description");
  //       document.head.appendChild(meta);
  //     }
  //     meta.setAttribute("content", properyData?.title || "");

  //     return () => {
  //       document.title = prevTitle;
  //       if (meta) meta.setAttribute("content", prevDesc);
  //     };
  //   }, [properyData]);

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
              <ProductImagesContainer productImageId={null} data={properyData} />
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
