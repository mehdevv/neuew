import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Location } from "@/lib/service/locations";
import { getS3UrlOrDefault } from "@/lib/utils";

export const ClusterMarkers = ({ locations }: { locations: Location[] }) => {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup();

    locations.forEach(({ latitude, longitude, name_fr, pic_cover }) => {
      const marker = L.marker([parseFloat(latitude), parseFloat(longitude)]);
      marker.bindPopup(
        `<img src="${getS3UrlOrDefault(pic_cover)}" alt="location cover" class="h-full w-full object-cover" />
         <h1 class="text-center text-lg font-bold">${name_fr}</h1>`,
      );

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [locations, map]);

  return null;
};
