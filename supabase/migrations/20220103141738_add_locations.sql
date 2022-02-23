CREATE TABLE public.locations (
	id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
	created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
	updated_at timestamp with time zone,
	name text NOT NULL,
	full_name text NOT NULL,
	alternate_names text,
	geoname_id integer,
	geo geography (point, 4326) NOT NULL,
	iso_alpha2 character (2),
	population bigint,
	nomad_factor integer,
	search_text text,
	picture uuid REFERENCES public.pictures (id)
);

CREATE TRIGGER handle_updated_at
	BEFORE UPDATE ON public.locations
	FOR EACH ROW
	EXECUTE FUNCTION extensions.moddatetime (updated_at);

CREATE INDEX locations_search ON public.locations USING GIN (search_text gin_trgm_ops);
