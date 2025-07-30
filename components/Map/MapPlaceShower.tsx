"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
// import { BusinessListDto, CategoryDto } from "@/api_services/home/home.interface";
import { renderToStaticMarkup } from "react-dom/server";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import { useRouter } from "next/navigation";
import LocationAnime from "../shared/Lotties/LocationAnime";
import PlacesMarker from "./MapShowplaceMarker";

type mapType = {
  disableCenter?: boolean;
  jumpToNow?: boolean;
  businessMarkersData?: any[];
  containerClass?: string;
  center: number[];

  setCenter: (e: number[]) => void | null;
  categoriesList?: any[] | undefined;
  setShowData?: Dispatch<any>;
  setJumpToNow?: Dispatch<SetStateAction<boolean>>;
  jumpToGivenPlace?: { lat?: number | string; lng?: number | string };
};

const API_KEY = "web.4c0887bbd32f4ab2ba1adcc36243b6a2";

const MapPlaceShower = ({
  center,
  setCenter,
  disableCenter,
  businessMarkersData,
  containerClass,

  setShowData,

  jumpToNow,
  setJumpToNow,
  jumpToGivenPlace,
}: mapType) => {
  const router = useRouter();
  const markers = useRef<any>(null);
  const map = useRef<any>(null);
  useEffect(() => {
    map.current = new nmp_mapboxgl.Map({
      mapType: nmp_mapboxgl.Map.mapTypes.neshanVector,
      container: map.current || "map",
      center: { lat: center[1], lng: center[0] },
      zoom: 16,
      minZoom: 2,
      maxZoom: 21,
      trackResize: true,
      mapKey: API_KEY,
      poi: false,

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
          timeout: 30000,
        },
        showAccuracyCircle: true,
        showUserLocation: true,
        trackUserLocation: true,
        showUserHeading: true,
      })
    );
    // map.current.addControl(new nmp_mapboxgl.NavigationControl(), "top-right");
    map.current.on("dragend", () => {
      setCenter([map.current.getCenter().lng, map.current.getCenter().lat]);
    });
  }, []);

  useEffect(() => {
    if (businessMarkersData) {
      if (markers?.current) markers?.current?.map((_: any) => _.remove());

      markers.current = businessMarkersData?.map((e) => {
        const element = document.createElement("div");
        const renderToStaticMarkupHelp: any = renderToStaticMarkup;
        const staticElement = renderToStaticMarkupHelp(<PlacesMarker />);
        element.innerHTML = staticElement;
        // element.onclick = () => {
        //   if (setShowData) setShowData(e);
        // };

        return new nmp_mapboxgl.Marker({ element: element, anchor: "center" })
          .setLngLat([e?.lng, e?.lat])
          .addTo(map.current);
      });
    }
  }, [businessMarkersData]);

  useEffect(() => {
    const lat = localStorage.getItem("lat");
    const lng = localStorage.getItem("lng");
    if (lat && lng && jumpToNow && setJumpToNow) {
      map?.current?.flyTo({ center: [lng, lat] });
      setJumpToNow(false);
    }
  }, [jumpToNow]);

  useEffect(() => {
    const lat = jumpToGivenPlace?.lat;
    const lng = jumpToGivenPlace?.lng;
    if (lat && lng && jumpToGivenPlace) {
      map?.current?.flyTo({ center: [lng, lat] });
    }
  }, [jumpToGivenPlace]);
  return (
    <div className={`map-wrap   relative ${containerClass}`}>
      <div ref={map} id="map" className="map " />
      {!disableCenter ? (
        // <img
        //   id={"center_location"}
        //   className="absolute w-8 cursor-pointer aspect-square top-1/2 left-1/2  "
        //   style={{ transform: "translate(-50%,-50%)" }}
        //   src="/assets/icons/addresses/location_center.svg"
        // />
        <LocationAnime />
      ) : (
        <></>
      )}
    </div>
  );
};

export default MapPlaceShower;
