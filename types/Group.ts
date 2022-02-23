export type Group = {
  id: string;
  name: string;
};

export type UserGroup = Group & { member: boolean };

export type GroupsUserProfiles = {
  user_profile_id: string;
  group_id: string;
};
