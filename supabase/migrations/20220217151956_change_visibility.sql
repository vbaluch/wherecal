DROP POLICY "Stays are viewable by all authenticated users." ON stays;

CREATE POLICY "Users can view their own stays." ON stays
	FOR SELECT
		USING (auth.uid () = user_profile_id);

CREATE OR REPLACE FUNCTION get_fellow_group_members ()
	RETURNS SETOF uuid
	LANGUAGE sql
	SECURITY DEFINER
	SET search_path = public STABLE
	AS $$
	SELECT
		user_profile_id
	FROM
		groups_user_profiles
	WHERE
		group_id = (
			SELECT
				group_id
			FROM
				groups_user_profiles
			WHERE
				user_profile_id = auth.uid ())
		AND user_profile_id != auth.uid ()
$$;

CREATE POLICY "Users can view fellow group members' profiles." ON user_profiles
	FOR SELECT
		USING (id IN (
			SELECT
				get_fellow_group_members ()));

CREATE POLICY "Users can view fellow group members' stays." ON stays
	FOR SELECT
		USING (user_profile_id IN (
			SELECT
				get_fellow_group_members ()));
