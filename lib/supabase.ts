import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Safe to use in the browser: relies on Row Level Security, which only
// allows read access with this key. All writes happen through our own
// API routes (see lib/supabaseAdmin.ts), never directly from the client.
export const supabase = createClient(url, anonKey);
