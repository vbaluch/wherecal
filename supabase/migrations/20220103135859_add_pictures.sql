CREATE TABLE public.pictures (
	id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
	created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
	updated_at timestamp with time zone,
	unsplash_id text NOT NULL,
	unsplash_url_raw text NOT NULL
);

CREATE TRIGGER handle_updated_at
	BEFORE UPDATE ON public.pictures FOR EACH ROW
	EXECUTE FUNCTION extensions.moddatetime (updated_at);
