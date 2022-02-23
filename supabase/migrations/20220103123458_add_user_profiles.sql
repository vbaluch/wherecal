CREATE TABLE public.user_profiles (
	id uuid PRIMARY KEY REFERENCES auth.users (id),
	created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
	updated_at timestamp with time zone,
	name text,
	is_public boolean NOT NULL DEFAULT FALSE,
	show_past boolean NOT NULL DEFAULT FALSE
);

CREATE TRIGGER handle_updated_at
	BEFORE UPDATE ON public.user_profiles FOR EACH ROW
	EXECUTE FUNCTION extensions.moddatetime (updated_at);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by users who created them." ON public.user_profiles
	FOR SELECT
		USING (auth.uid () = id);

CREATE POLICY "Public profiles are viewable by everyone." ON public.user_profiles
	FOR SELECT
		USING (is_public = TRUE);

CREATE POLICY "Users can insert their own profile." ON public.user_profiles
	FOR INSERT
		WITH CHECK (auth.uid () = id);

CREATE POLICY "Users can update their own profile." ON public.user_profiles
	FOR UPDATE
		USING (auth.uid () = id);

CREATE FUNCTION public.handle_new_user ()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SECURITY DEFINER
	SET search_path = public
	AS $$
BEGIN
	INSERT INTO public.user_profiles (id)
		VALUES (NEW.id);
	RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
	AFTER INSERT ON auth.users FOR EACH ROW
	EXECUTE PROCEDURE public.handle_new_user ();
