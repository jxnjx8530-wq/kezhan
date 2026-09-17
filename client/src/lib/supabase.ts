import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// null until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set (e.g. in
// Vercel's Environment Variables). Pages check for this before using it so
// the site doesn't crash while Supabase isn't configured yet.
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;
