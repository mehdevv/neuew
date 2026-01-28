"use client";

import { useLocations } from "@/hooks/useLocations";
import type {
  FeatureCollection,
  Feature,
  Polygon,
  MultiPolygon,
  Position,
} from "geojson";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { MapSheet } from "./MapSheet";
import "leaflet.markercluster";
import L from "leaflet";
import { ClusterMarkers } from "./ClusterMarkers";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/map-icons/marker-icon.png",
  iconUrl: "/images/map-icons/marker-icon.png",
  shadowUrl: "/images/map-icons/marker-shadow.png",
});

function createMaskGeoJSON(
  algeriaGeoJson:
    | FeatureCollection<Polygon | MultiPolygon>
    | Feature<Polygon | MultiPolygon>,
): FeatureCollection<Polygon> {
  const worldOuter: [number, number][] = [
    [-180, -90],
    [-180, 90],
    [180, 90],
    [180, -90],
    [-180, -90],
  ];

  const holes: Array<Position[]> = [];

  const features: Feature<Polygon | MultiPolygon>[] =
    algeriaGeoJson.type === "FeatureCollection"
      ? (algeriaGeoJson.features as Feature<Polygon | MultiPolygon>[])
      : [algeriaGeoJson as Feature<Polygon | MultiPolygon>];

  features.forEach((feat) => {
    const geom = feat.geometry;
    if (!geom) return;
    if (geom.type === "Polygon") {
      holes.push(geom.coordinates[0]);
    } else if (geom.type === "MultiPolygon") {
      geom.coordinates.forEach((poly) => holes.push(poly[0]));
    }
  });

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [worldOuter, ...holes],
        },
      },
    ],
  };
}

export default function AlgeriaMapCutout() {
  const [mask, setMask] = useState<FeatureCollection<Polygon> | null>(null);

  useEffect(() => {
    // fetch Algeria geometry from somewhere
    fetch("/algeria.geo.json")
      .then((res) => res.json())
      .then((geojson) => {
        const mask = createMaskGeoJSON(geojson);
        setMask(mask);
      });
  }, []);

  const { data: locations, isLoading: locationsLoading } = useLocations();

  if (!mask || locationsLoading) return <div>Loading...</div>;
  if (!locations) return <div>No locations found</div>;

  return (
    <MapContainer
      center={[28.0339, 1.6596]}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
      // optional: keep user in Algeria bounding box
      maxBounds={[
        [18.96, -8.67],
        [37.09, 11.98],
      ]}
      maxBoundsViscosity={1}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClusterMarkers locations={locations} />

      {/* mask: everything shaded except Algeria (hole) */}
      <GeoJSON
        data={mask}
        style={() => ({
          color: "transparent",
          weight: 0,
          fillOpacity: 1,
          fillColor: "#f2efe9",
          fillRule: "evenodd",
        })}
      />
      <div className="fixed bottom-5 left-5 z-[1000]">
        <MapSheet locations={locations} />
      </div>
    </MapContainer>
  );
}
