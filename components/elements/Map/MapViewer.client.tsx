"use client";

import type { MapViewerProps } from "@/types/components/elements/map";
import { useEffect, useEffectEvent, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import LocationAnime from "@/components/shared/Lotties/LocationAnime";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import PlacesMarker from "./MapMarker";

const API_KEY = "web.4c0887bbd32f4ab2ba1adcc36243b6a2";

const MapPlaceShower = ({
  center,
  jumpToNow,
  setCenter,
  setJumpToNow,
  disableCenter,
  containerClass,
  jumpToGivenPlace,
  businessMarkersData,
}: MapViewerProps) => {
  const markers = useRef<any[]>([]);
  const map = useRef<any>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const initialCenterRef = useRef(center);
  const updateCenter = useEffectEvent((nextCenter: number[]) =>
    setCenter(nextCenter),
  );
  useEffect(() => {
    map.current = new nmp_mapboxgl.Map({
      mapType: nmp_mapboxgl.Map.mapTypes.neshanVector,
      container: mapContainer.current || "map",
      center: {
        lat: initialCenterRef.current[1],
        lng: initialCenterRef.current[0],
      },
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
      }),
    );
    const handleDragEnd = () => {
      updateCenter([map.current.getCenter().lng, map.current.getCenter().lat]);
    };
    map.current.on("dragend", handleDragEnd);
    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      map.current?.off("dragend", handleDragEnd);
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (businessMarkersData) {
      markers.current.forEach((marker) => marker.remove());
      markers.current = businessMarkersData?.map((e) => {
        const element = document.createElement("div");
        const renderToStaticMarkupHelp: any = renderToStaticMarkup;
        const staticElement = renderToStaticMarkupHelp(<PlacesMarker />);
        element.innerHTML = staticElement;
        return new nmp_mapboxgl.Marker({ element: element, anchor: "center" })
          .setLngLat([Number(e?.lng), Number(e?.lat)])
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
  }, [jumpToNow, setJumpToNow]);

  useEffect(() => {
    const lat = jumpToGivenPlace?.lat;
    const lng = jumpToGivenPlace?.lng;
    if (lat && lng && jumpToGivenPlace) {
      map?.current?.flyTo({ center: [lng, lat] });
    }
  }, [jumpToGivenPlace]);
  return (
    <div className={`map-wrap   relative ${containerClass}`}>
      <div ref={mapContainer} id="map" className="map " />
      {!disableCenter ? <LocationAnime /> : <></>}
    </div>
  );
};

export default MapPlaceShower;
