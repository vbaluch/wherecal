import { Picture } from "./Picture";

export type Location = {
  id: string;
  name: string;
  full_name: string;
  search_text: string;
  geo: GeoJSON.Point;
  picture?: Picture;
};
