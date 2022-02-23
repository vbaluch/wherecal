import { supabase } from "./supabaseClient";

import { Group, UserGroup, GroupsUserProfiles } from "../types/Group";

export async function getAllUserGroups(): Promise<UserGroup[]> {
  try {
    const user = supabase.auth.user();

    if (!user) {
      throw new Error("trying to access groups when not authenticated");
    }

    const {
      data: groupsData,
      error: groupsError,
      status: groupsStatus,
    } = await supabase.from<Group>("groups").select(`id,name`);
    if (groupsError && groupsStatus !== 406) {
      throw groupsError;
    }
    const {
      data: groupsUserProfilesData,
      error: groupsUserProfilesError,
      status: groupsUserProfilesStatus,
    } = await supabase
      .from<GroupsUserProfiles>("groups_user_profiles")
      .select(`user_profile_id,group_id`)
      .eq("user_profile_id", user.id);
    if (groupsUserProfilesError && groupsUserProfilesStatus !== 406) {
      throw groupsUserProfilesError;
    }

    if (groupsData && groupsUserProfilesData) {
      return groupsData.map((group) => {
        const groupWithMembership = {
          ...group,
          member: groupsUserProfilesData?.find((el) => {
            return el.group_id == group.id;
          })
            ? true
            : false,
        };
        return groupWithMembership;
      });
    }
  } catch (error) {
    alert(JSON.stringify(error));
  }
  return [];
}

export async function leaveGroup(group: UserGroup) {
  try {
    const user = supabase.auth.user();
    if (!user) {
      throw new Error("trying to leave group when not authenticated");
    }
    if (!group.member)
      throw new Error("trying to leave group without being a member");
    const { error, status } = await supabase
      .from<GroupsUserProfiles>("groups_user_profiles")
      .delete({ returning: "minimal" })
      .eq("user_profile_id", user.id)
      .eq("group_id", group.id);
    if (error && status !== 406) {
      throw error;
    }
  } catch (error) {
    alert(JSON.stringify(error));
  }
}

export async function joinGroup(group: UserGroup) {
  try {
    const user = supabase.auth.user();
    if (!user) {
      throw new Error("trying to join group when not authenticated");
    }
    if (group.member)
      throw new Error("trying to join when already being a member");
    const { error, status } = await supabase
      .from<GroupsUserProfiles>("groups_user_profiles")
      .insert({
        user_profile_id: user.id,
        group_id: group.id,
      });
    if (error && status !== 406) {
      throw error;
    }
  } catch (error) {
    alert(JSON.stringify(error));
  }
}
