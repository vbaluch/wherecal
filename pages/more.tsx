import React from "react";
import { useState, useEffect } from "react";
import type { Session as AuthSession } from "@supabase/gotrue-js";
import { supabase } from "../utils/supabaseClient";
import Layout from "../components/Layout";
import UserProfileCard from "../components/UserProfileCard";
import Link from "next/link";
import Groups from "../components/Groups";

export default function More() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Layout>
      {!session ? (
        <Link href="/">Not signed in.</Link>
      ) : (
        <div className="px-2 w-full sm:w-6/12 md:w-4/12 flex flex-col flex-nowrap">
          <h2 className="text-white">Profile</h2>
          <UserProfileCard key="user-profile-card" session={session} />
          <h2 className="text-white">Groups</h2>
          <Groups />
          <Link href="/legal" passHref>
            <a className="text-white">Legal</a>
          </Link>
        </div>
      )}
    </Layout>
  );
}
