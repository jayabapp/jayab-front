"use client";

import type { InteractiveMapProps } from "@/types/components/elements/map";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import Image from "next/image";

const Map = ({
  center,
  setCenter,
  jumpToState,
  disableCenter,
  containerClass,
}: InteractiveMapProps) => {
  const initialMap = useRef<any>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const initialCenterRef = useRef(center);
  const [zoom] = useState(15);
  const [API_KEY] = useState("web.4c0887bbd32f4ab2ba1adcc36243b6a2");
  const updateCenter = useEffectEvent((nextCenter: number[]) => {
    setCenter?.(nextCenter);
  });

  useEffect(() => {
    if (initialMap.current) return;
    initialMap.current = new nmp_mapboxgl.Map({
      mapType: nmp_mapboxgl.Map.mapTypes.neshanRaster,
      container: mapContainer.current || "map",
      center: [initialCenterRef.current[0], initialCenterRef.current[1]],
      zoom: zoom,
      minZoom: 2,
      maxZoom: 21,
      trackResize: true,
      mapKey: API_KEY,
      poi: true,
      traffic: false,
      mapTypeControllerOptions: {
        show: false,
        position: "top-left",
      },
    });

    initialMap.current.addControl(
      new nmp_mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
    );
    initialMap.current.addControl(
      new nmp_mapboxgl.NavigationControl(),
      "top-right",
    );
    const handleMove = () => {
      const currentCenter = initialMap.current.getCenter();
      updateCenter([currentCenter.lng, currentCenter.lat]);
    };
    initialMap.current.on("move", handleMove);
    return () => {
      initialMap.current?.off("move", handleMove);
      initialMap.current?.remove();
      initialMap.current = null;
    };
  }, [API_KEY, zoom]);

  useEffect(() => {
    if (!!jumpToState) {
      initialMap.current?.jumpTo(
        { center: [jumpToState?.lng, jumpToState?.lat] },
        2000,
      );
    }
  }, [jumpToState]);

  return (
    <div className="map-wrap relative">
      <div
        ref={mapContainer}
        id="map"
        key="mapBox"
        className={`map ${!!containerClass ? containerClass : "w-screen aspect-square"} `}
      />
      {!disableCenter ? (
        <Image
          alt=""
          width={32}
          height={32}
          id={"center_location"}
          style={{ transform: "translate(-50%,-50%)" }}
          src="/assets/icons/addresses/location_center.svg"
          className="absolute w-8 cursor-pointer aspect-square top-1/2 left-1/2  "
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Map;
