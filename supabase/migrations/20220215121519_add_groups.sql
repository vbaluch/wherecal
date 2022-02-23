CREATE TABLE GROUPS (
	id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
	created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
	updated_at timestamp with time zone,
	name text NOT NULL,
	slack_team_id text NOT NULL
);

CREATE TRIGGER handle_updated_at
	BEFORE UPDATE ON public.groups
	FOR EACH ROW
	EXECUTE FUNCTION extensions.moddatetime (updated_at);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_slack_team_ids_for_authenticated_user ()
	RETURNS SETOF text
	LANGUAGE sql
	SECURITY DEFINER
	SET search_path = public STABLE
	AS $$
	SELECT
		auth.identities.identity_data::json -> 'custom_claims' ->> 'https://slack.com/team_id'
	FROM
		auth.identities
	WHERE
		auth.identities.user_id = auth.uid ()
		AND auth.identities.provider = 'slack';

$$;

CREATE POLICY "Groups are visible for users with a matching Slack Team ID." ON GROUPS
	FOR SELECT
		USING (slack_team_id IN (
			SELECT
				get_slack_team_ids_for_authenticated_user ()));

CREATE TABLE groups_user_profiles (
	id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
	created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
	updated_at timestamp with time zone,
	user_profile_id uuid NOT NULL REFERENCES user_profiles (id),
	group_id uuid NOT NULL REFERENCES GROUPS (id)
);

ALTER TABLE groups_user_profiles
	ADD UNIQUE (user_profile_id, group_id);

CREATE TRIGGER handle_updated_at
	BEFORE UPDATE ON public.groups_user_profiles
	FOR EACH ROW
	EXECUTE FUNCTION extensions.moddatetime (updated_at);

ALTER TABLE public.groups_user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own group memberships." ON groups_user_profiles
	FOR SELECT
		USING (user_profile_id = auth.uid ());

CREATE POLICY "Users can delete their own group memberships." ON groups_user_profiles
	FOR DELETE
		USING (user_profile_id = auth.uid ());

CREATE POLICY "Groups are visible for members." ON GROUPS
	FOR SELECT
		USING (id IN (
			SELECT
				group_id
			FROM
				groups_user_profiles
			WHERE
				user_profile_id = auth.uid ()));

CREATE POLICY "Users can join groups with a matching Slack Team ID." ON groups_user_profiles
	FOR INSERT
		WITH CHECK (user_profile_id = auth.uid ()
		AND group_id IN (WITH user_slack_team_ids AS (
			SELECT
				get_slack_team_ids_for_authenticated_user () AS id)
					SELECT
						groups.id
					FROM
						groups
						INNER JOIN user_slack_team_ids ON groups.slack_team_id = user_slack_team_ids.id));
