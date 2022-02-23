CREATE TABLE stays (
	id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
	created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
	updated_at timestamp with time zone,
	user_profile_id uuid NOT NULL REFERENCES user_profiles (id),
	from_date date NOT NULL,
	to_date date NOT NULL,
	location uuid NOT NULL REFERENCES public.locations (id)
);

CREATE TRIGGER handle_updated_at
	BEFORE UPDATE ON public.stays
	FOR EACH ROW
	EXECUTE FUNCTION extensions.moddatetime (updated_at);

ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stays are viewable by all authenticated users." ON stays
	FOR SELECT
		USING (auth.role () = 'authenticated');

CREATE POLICY "Users can insert their own stays." ON stays
	FOR INSERT
		WITH CHECK (auth.uid () = user_profile_id);

CREATE POLICY "Users can update their own stays." ON stays
	FOR UPDATE
		USING (auth.uid () = user_profile_id);

CREATE POLICY "Users can delete their own stays." ON stays
	FOR DELETE
		USING (auth.uid () = user_profile_id);
