"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import { debounce } from "lodash";
import getAddress from "./GetAddress";
import CreateMarker from "./CreateMarker";
type mapType = {
  setCenterAddressLoading?: (e: boolean) => void | null;
  setCenterAddress?: (e: string) => void | null;

  refMap?: React.MutableRefObject<any>;

  disableCenter?: boolean;
  containerClass?: string;

  center: number[];
  setCenter?: (e: number[]) => void | null;
  setMarkers?: (e: (x: any[]) => any[]) => void | null;
};

const Map = ({
  refMap,

  setCenterAddress,
  setCenterAddressLoading,

  center,
  setCenter,
  setMarkers,
  disableCenter,
  containerClass,
}: mapType) => {
  const initialMap = useRef<any>(null);
  const map = refMap || initialMap;
  const mapContainer = useRef<HTMLDivElement>(null);

  // const map = useRef<any>(null);

  const [isMoving, setIsMoving] = useState(false);
  const [zoom] = useState(15);
  const [API_KEY] = useState("web.61b0b695499f4469bec2afe62cf7e6a8");
  const [refExists, setRefExists] = useState(false);
  // const [center, setCenter] = useState([lng, lat]);

  const checkTyping = useCallback(
    debounce(() => {
      setIsMoving(false);
    }, 1000),
    []
  );

  useEffect(() => {
    if (center[0] && !isMoving) {
      setTimeout(
        () =>
          getAddress({
            latitude: center[1],
            longitude: center[0],
            setCenterAddress: setCenterAddress,
            setCenterAddressLoading: setCenterAddressLoading,
          }),
        1000
      );
    }
  }, [center, isMoving]);

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new nmp_mapboxgl.Map({
      mapType: nmp_mapboxgl.Map.mapTypes.neshanRaster,
      container: mapContainer.current || "map",
      center: [center[0], center[1]],
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

    map.current.addControl(
      new nmp_mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
    map.current.addControl(new nmp_mapboxgl.NavigationControl(), "top-right");
    map.current.on("move", () => {
      if (setCenter) {
        setCenter([map.current.getCenter().lng, map.current.getCenter().lat]);
      }
      setIsMoving(true);
      checkTyping();
    });
  }, [API_KEY, zoom, map, mapContainer]);

  return (
    <div className="map-wrap relative">
      <div
        ref={mapContainer}
        id="map"
        key="mapBox"
        className={`map ${!!containerClass ? containerClass : "w-screen aspect-square"} `}
      />
      {!disableCenter ? (
        <img
          id={"center_location"}
          className="absolute w-8 cursor-pointer aspect-square top-1/2 left-1/2  "
          style={{ transform: "translate(-50%,-50%)" }}
          src="/assets/icons/addresses/location_center.svg"
          onClick={() => {
            const el = CreateMarker({
              url: "/assets/icons/map/end_loc.svg",
            });

            if (setMarkers)
              setMarkers((e) => [
                ...e,
                new nmp_mapboxgl.Marker({ element: el, anchor: "center" })
                  .setLngLat([center[0], center[1]])
                  .addTo(map.current),
              ]);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Map;
