"use client";

import { HomeService } from "@/api_services/home/home.service";
import Breadcrumbs from "@/components/BreadCrumbs";
import Editable from "@/components/Editable";

import CreateMarker from "@/components/Map/CreateMarker";
import ContactUsPageItem from "@/components/contactus/ContactUsPageItem";
import ContactuUItem from "@/components/contactus/ContactuUItem";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";

import _STRINGS from "@/utils/LocalStrings";

import { useQuery } from "@tanstack/react-query";

import dynamic from "next/dynamic";

import React, { useEffect, useMemo, useRef, useState } from "react";

const Channels = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map/MapPlaceShower"), {
        ssr: false,
      }),
    []
  );

  const { data, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENTS_CACHEKEY, "contactUs", 1],
    queryFn: () => {
      return HomeService.GetContent({ key: "contactUs", page: 1 });
    },
  });
  const [center, setCenter] = useState([51.3778346, 35.7709651]);
  const socials = data?.data?.filter((e) => e?.fields?.key == "social");
  const others = data?.data?.filter((e) => e?.fields?.key !== "social" && !!e?.small_text);

  const locationPosition = data?.data?.find((e) => e?.key == "address")?.full_text?.split(",");

  useEffect(() => {
    const el = CreateMarker({
      url: "/assets/icons/forms/location.svg",
    });
  }, [locationPosition]);

  return (
    <div id="homeParent" className="container    transition-all duration-500 ease-in-out ">
      <Breadcrumbs />
      {isLoading ? <LottieLoading /> : <></>}

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
          )}
        </div>
        <div className="flex w-full  md:order-1 order-1 flex-col items-center md:items-start justify-center ">
          {" "}
          {data?.data && data?.data[0]?.category?.description ? (
            <p className="text-sm text-justify  mt-8">{data?.data[0]?.category?.description}</p>
          ) : (
            <></>
          )}
          <div className="flex flex-col mt-8 gap-4 w-full   ">
            <p className=" text-base md:text-xl font-bold">{_STRINGS.CONTACT_WAYS}</p>
            {others && others?.length > 0 ? (
              others?.map((e) => <ContactUsPageItem e={e} key={`${e?.id}MAINcONT`} />)
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-row items-center w-full justify-start md:w-auto mt-8 gap-4">
            {socials && socials?.length > 0 ? (
              socials?.map((e) => <ContactuUItem e={e} key={`${e?.id}SocialcONT`} disableText={true} />)
            ) : (
              <></>
            )}
          </div>
        </div>{" "}
      </Editable>
    </div>
  );
};

export default Channels;
