"use client";
import dynamic from "next/dynamic";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const AlgeriaMapCutout = dynamic(
  () => import("./_components/AlgeriaMapCutout"),
  { ssr: false },
);

export default function MapPage() {
  return <AlgeriaMapCutout />;
}
