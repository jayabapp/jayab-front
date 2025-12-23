import Headers from "@/components/headers";
import AnimationlessModal from "@/components/Modal/AnimationlessModal";
import dynamic from "next/dynamic";

import Footer from "@/components/Footer";
import { headers } from "next/headers";

const ProductImagesContainer = dynamic(() => import("@/components/properties/imageComponents/PropertiesImagesPart"));
const SinglePropertyIntroduction = dynamic(() => import("@/components/properties/SinglePropertyIntroduction"));
const SinglePropertycallender = dynamic(() => import("@/components/properties/SinglePropertycallender"));
const SinglePorpertyAccards = dynamic(() => import("@/components/properties/SinglePropertyAccards"));

const ModalServer = async ({ params }: { params: Promise<{ room_slug: string }> }) => {
  //   const incomingParams = params;
  //   const pathname = usePathname();

  //   const { data: properyData, isPending } = useQuery({
  //     queryKey: [PropertyService?.GET_SINGLEPROPERTY_SlUG_CACHEKEY, incomingParams?.room_slug],
  //     queryFn: () => {
  //       if (incomingParams?.room_slug)
  //         return PropertyService?.GetSinglePropertyWithSlug({ Property_slug: incomingParams?.room_slug });
  //       else {
  //         return null;
  //       }
  //     },
  //   });

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
  const requestHeaders = await headers();
  const xPath = requestHeaders?.get("x-pathname");

  console.log(xPath, "xPathxPath");
  return (
    <AnimationlessModal
      show={xPath?.includes("rooms/") ? true : false}
      options={{
        containerClass:
          " app-size app-text  relative  rounded-lg overflow-y-scroll  bg-white !rounded-none dark:bg-dark-900",
        parentClass: "bg-white",
      }}
    >
      <Headers />
      <div className=" w-full">
        {/* <SinglePropertyPage isModal params={params} /> */}
        {/* {!!isPending ? (
          <ProductSkeleton />
        ) : !!properyData ? (
          <>
            <Suspense>
              <ProductImagesContainer productImageId={null} data={properyData} />
            </Suspense>
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
        )} */}
      </div>
      <Footer />
    </AnimationlessModal>
  );
};

export default ModalServer;
