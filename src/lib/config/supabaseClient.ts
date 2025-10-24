// lib/supabaseClient.ts

import { createClient, SupabaseClient } from "@supabase/supabase-js";

import {
  SUPABASE_FOCUSPOND_BASE_URL,
  SUPABASE_FOCUSPOND_ANON_KEY,
} from "../constants";

const url = SUPABASE_FOCUSPOND_BASE_URL;
const anonKey = SUPABASE_FOCUSPOND_ANON_KEY;

// Basic runtime validation with helpful error messages
if (!url || !anonKey) {
  if (typeof window === "undefined") {
    // Server-side: fail fast so server deploys show clear error logs
    throw new Error(
      "Missing SUPABASE_FOCUSPOND_BASE_URL or SUPABASE_FOCUSPOND_ANON_KEY environment variables."
    );
  } else {
    // Client-side: avoid throwing during hydration — log and create a no-op client pattern
    // but still throw so developers notice during development.
    console.error(
      "Missing SUPABASE_FOCUSPOND_BASE_URL or SUPABASE_FOCUSPOND_ANON_KEY environment variables."
    );
    throw new Error("Supabase client not configured.");
  }
}

// Create a single shared client instance for the browser
export const supabase: SupabaseClient = createClient(url, anonKey, {
  // Optional global settings — adjust as needed
  // For example: realtime: { params: { eventsPerSecond: 10 } }
});
