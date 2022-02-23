import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import type { Session as AuthSession } from "@supabase/gotrue-js";
import AuthForm from "../components/AuthForm";
import Layout from "../components/Layout";
import FriendsStays from "../components/FriendsStays";

export default function Friends() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setLoading(true);
    setSession(supabase.auth.session());
    setLoading(false);

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) {
    return (
      <Layout>
        <span>Loading…</span>
      </Layout>
    );
  } else if (!session) {
    return (
      <Layout withoutHeader={true}>
        <AuthForm />
      </Layout>
    );
  } else {
    return (
      <Layout>
        <FriendsStays />
      </Layout>
    );
  }
}
