import { useState, useEffect, MouseEvent } from "react";
import { useRouter } from "next/router";
import { Session as AuthSession } from "@supabase/gotrue-js";

import { supabase } from "../utils/supabaseClient";
import { UserProfile } from "../types/UserProfile";

export default function UserProfileCard({
  session,
}: {
  session: AuthSession | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    getProfile();
  }, [session]);

  const onSignOutLinkClick = async (e: MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    await router.push("/");
  };

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      if (!user) {
        throw new Error("trying to access user profile when not authenticated");
      }

      let { data, error, status } = await supabase
        .from<UserProfile>("user_profiles")
        .select(`id, name`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setName(data.name);
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ name }: { name: string }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      if (!user) {
        throw new Error("trying to access user profile when not authenticated");
      }

      const updates: UserProfile = {
        id: user.id,
        name: name,
      };

      let { error } = await supabase
        .from<UserProfile>("user_profiles")
        .upsert(updates, {
          returning: "minimal",
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }

  // TODO styling
  return (
    <div className="form-widget text-white">
      <div>
        <label htmlFor="name">Name</label>
        <input
          className="form-input text-black"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          onClick={() => updateProfile({ name })}
          disabled={loading}
        >
          {loading ? "Loading…" : "Update"}
        </button>
      </div>

      <div>
        <button className="button block" onClick={onSignOutLinkClick}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
