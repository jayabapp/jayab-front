"use client";

import Breadcrumbs from "@/components/BreadCrumbs";
import Editable from "@/components/Editable";

import CreateMarker from "@/components/Map/CreateMarker";
import ContactUsPageItem from "@/components/contactus/ContactUsPageItem";
import ContactuUItem from "@/components/contactus/ContactuUItem";
import { HTMLGenerator } from "@/helpers/html.generator";

import _STRINGS from "@/utils/LocalStrings";

import dynamic from "next/dynamic";

import { Suspense, useEffect, useMemo, useState } from "react";

const ContactUsPageHelper = ({ data }: { data: any }) => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map/MapPlaceShower"), {
        ssr: false,
      }),
    []
  );

  const [center, setCenter] = useState([51.3778346, 35.7709651]);
  const socials = data?.data?.filter((e: any) => e?.fields?.key == "social");
  const others = data?.data?.filter((e: any) => e?.fields?.key !== "social" && !!e?.small_text);

  const locationPosition = data?.data?.find((e: any) => e?.key == "address")?.full_text?.split(",");

  useEffect(() => {
    const el = CreateMarker({
      url: "/assets/icons/forms/location.svg",
    });
  }, [locationPosition]);

  const { html } = HTMLGenerator(data?.data[0]?.category?.description || "", {
    hasHeading: true,
    hasCount: true,
  });

  return (
    <div id="homeParent" className="container    transition-all duration-500 ease-in-out ">
      <Breadcrumbs />

      <Editable
        isParent={true}
        contentId={data?.data?.[0]?.category?.id}
        className="grid grid-cols-1 md:grid-cols-2  items-start gap-8  "
      >
        <div className="flex  col-span-full w-full items-center justify-center">
          <p className=" text-primary-700 text-lg text-center font-extrabold  md:text-2xl">{_STRINGS.CONTACT_US}</p>
        </div>
        <div className="w-full overflow-clip aspect-[1.3] relative rounded-md  md:order-2 order-2  ">
          {" "}
          {locationPosition && locationPosition[0] && (
            <Suspense>
              {" "}
              <Map
                disableCenter={true}
                center={[Number(locationPosition[1]), Number(locationPosition[0])]}
                setCenter={setCenter}
                businessMarkersData={[
                  {
                    lat: Number(locationPosition[0]) || 0,
                    lng: Number(locationPosition[1]) || 0,
                    icon: "/assets/icons/orders/location.svg",
                  },
                ]}
              />
            </Suspense>
          )}
        </div>
        <div className="flex w-full  md:order-1 order-1 flex-col items-center md:items-start justify-center ">
          {" "}
          {data?.data && !!html ? (
            <div
              className=" !text-justify whitespace-pre-wrap  content blogBody category_table transition-all leading-7  "
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
          ) : (
            <></>
          )}
          <div className="flex flex-col mt-8 gap-4 w-full   ">
            <p className=" text-base md:text-xl font-bold">{_STRINGS.CONTACT_WAYS}</p>
            {others && others?.length > 0 ? (
              others?.map((e: any) => <ContactUsPageItem e={e} key={`${e?.id}MAINcONT`} />)
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-row items-center w-full justify-start md:w-auto mt-8 gap-4">
            {socials && socials?.length > 0 ? (
              socials?.map((e: any) => <ContactuUItem e={e} key={`${e?.id}SocialcONT`} disableText={true} />)
            ) : (
              <></>
            )}
          </div>
        </div>{" "}
      </Editable>
    </div>
  );
};

export default ContactUsPageHelper;
