import { supabase } from "./supabaseClient";

import { UserStay } from "../types/Stay";

export async function getAllOwnStays(): Promise<UserStay[]> {
  try {
    const user = supabase.auth.user();

    if (!user) {
      throw new Error("trying to access own stays when not authenticated");
    }

    let { data, error, status } = await supabase
      .from<UserStay>("stays")
      .select(
        `id,user_profiles(name),from_date,to_date,location(name,geo::json,picture(unsplash_url_raw))`
      )
      .eq("user_profile_id", user.id)
      .order("from_date", { ascending: false });

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      return data;
    }
  } catch (error) {
    alert(JSON.stringify(error));
  }
  return [];
}

export async function getFriendsStays(): Promise<UserStay[]> {
  try {
    const user = supabase.auth.user();

    if (!user) {
      throw new Error("trying to access stays when not authenticated");
    }

    let inNinetyDays = new Date();
    inNinetyDays.setDate(inNinetyDays.getDate() + 90);

    let { data, error, status } = await supabase
      .from<UserStay>("stays")
      .select(
        `id,user_profiles(name),from_date,to_date,location(name,geo::json)`
      )
      .lte("from_date", inNinetyDays.toISOString().split("T")[0])
      .gte("to_date", new Date().toISOString().split("T")[0])
      .order("from_date", { ascending: false });

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      // TODO refactor this hack
      return data.filter((stay) => stay.user_profiles);
    }
  } catch (error) {
    alert(JSON.stringify(error));
  }
  return [];
}
