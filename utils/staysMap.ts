import { UserStay } from "../types/Stay";

export function generateStaysGeoJSON(
  stays: UserStay[]
): GeoJSON.FeatureCollection {
  const stayFeatures: GeoJSON.Feature[] = stays.map((stay) => {
    return {
      type: "Feature",
      geometry: stay.location.geo,
      properties: {
        title: `${stay.user_profiles.name} – ${stay.location.name}\n${stay.from_date} – ${stay.to_date}`,
      },
    };
  });
  return {
    type: "FeatureCollection",
    features: stayFeatures,
  };
}
