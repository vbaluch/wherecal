import { useEffect, useRef, useState } from "react";

import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import { UserStay } from "../types/Stay";
import { generateStaysGeoJSON } from "../utils/staysMap";

const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (!mapboxAccessToken) {
  throw new Error("Unexpected error: missing Mapbox env var.");
}
mapboxgl.accessToken = mapboxAccessToken;

export default function StaysMap(props: { stays: UserStay[] | null }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    async function updateMap() {
      if (props.stays && map && map.current && mapReady) {
        let source: GeoJSONSource = map.current.getSource(
          "points"
        ) as GeoJSONSource;
        const staysData = generateStaysGeoJSON(props.stays);
        if (!map.current?.hasImage("custom-marker")) {
          map.current?.loadImage(
            "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
            (error, image) => {
              if (!image) return;
              if (error) throw error;
              map.current?.addImage("custom-marker", image);
            }
          );
        }
        if (!source) {
          map.current.addSource("points", { type: "geojson", data: staysData });
        } else {
          source.setData(generateStaysGeoJSON(props.stays));
        }
        if (
          map.current.getSource("points") &&
          !map.current.getLayer("points")
        ) {
          map.current.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-size": 10,
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
            paint: {
              "text-color": "#fff",
            },
          });
        }
      }
    }
    updateMap();
  }, [props.stays, mapReady]);

  useEffect(() => {
    if (!mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v10",
    });
    if (!map.current) {
      return;
    }
    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.on("load", () => {
      checkMapReadiness();
    });
    map.current.on("styledata", () => {
      checkMapReadiness();
    });
  }, [mapContainer]);

  function checkMapReadiness() {
    if (map.current?.isStyleLoaded()) {
      setMapReady(true);
    }
  }

  return <div className="h-screen" ref={mapContainer} />;
}
