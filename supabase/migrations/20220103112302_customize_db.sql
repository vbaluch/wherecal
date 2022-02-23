CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;

CREATE OR REPLACE FUNCTION geography_to_geojson (geography)
	RETURNS json
	AS $$
	SELECT
		extensions.ST_AsGeoJSON ($1)::json;

$$
LANGUAGE SQL;

CREATE CAST (geography AS json) WITH FUNCTION geography_to_geojson (geography);
