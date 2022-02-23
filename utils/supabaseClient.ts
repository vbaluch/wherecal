import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!(supabaseURL && supabaseAnonKey)) {
  throw new Error("Unexpected error: missing Supabase env vars.");
}

export const supabase = createClient(supabaseURL, supabaseAnonKey);
