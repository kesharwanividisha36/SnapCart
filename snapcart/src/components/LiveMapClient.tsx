"use client";

import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

interface ILocation {
  latitude: number;
  longitude: number;
}

interface IProps {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}

function Recenter({ position }: { position: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);

  return null;
}

export default function LiveMapClient({
  userLocation,
  deliveryBoyLocation,
}: IProps) {
  const userIcon = useMemo(
    () =>
      L.icon({
        iconUrl:
          "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
        iconSize: [45, 45],
      }),
    []
  );

  const deliveryBoyIcon = useMemo(
    () =>
      L.icon({
        iconUrl:
          "https://cdn-icons-png.flaticon.com/128/1023/1023448.png",
        iconSize: [45, 45],
      }),
    []
  );

  const center: LatLngExpression = [
    userLocation.latitude,
    userLocation.longitude,
  ];

  const linePositions: LatLngExpression[] = deliveryBoyLocation
    ? [
        [userLocation.latitude, userLocation.longitude],
        [
          deliveryBoyLocation.latitude,
          deliveryBoyLocation.longitude,
        ],
      ]
    : [];

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow relative z-2">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full"
      >
        <Recenter position={center} />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap © CARTO"
        />

        <Marker position={center} icon={userIcon}>
          <Popup>Delivery Address</Popup>
        </Marker>

        {deliveryBoyLocation && (
          <Marker
            position={[
              deliveryBoyLocation.latitude,
              deliveryBoyLocation.longitude,
            ]}
            icon={deliveryBoyIcon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}

        <Polyline positions={linePositions} color="green" />
      </MapContainer>
    </div>
  );
}