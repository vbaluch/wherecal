DROP POLICY "Public profiles are viewable by everyone." ON public.user_profiles;

ALTER TABLE "public"."user_profiles"
	DROP COLUMN "is_public",
	DROP COLUMN "show_past";
