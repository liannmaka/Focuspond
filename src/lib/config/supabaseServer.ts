// lib/supabaseServer.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

import {
  SUPABASE_FOCUSPOND_SERVICE_ROLE_KEY,
  SUPABASE_FOCUSPOND_BASE_URL,
} from "../constants";

/**
 * Server-only factory for a Supabase client using the service role key.
 * IMPORTANT: Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 *
 * Usage:
 *   const supabase = getServiceSupabase();
 *   const { data, error } = await supabase.from('table').select('*');
 */

// Environment values
const url = SUPABASE_FOCUSPOND_BASE_URL;
const serviceRoleKey = SUPABASE_FOCUSPOND_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  // Fail fast on the server to avoid accidentally running without credentials
  throw new Error(
    "Missing SUPABASE_FOCUSPOND_SERVICE_ROLE_KEY or SUPABASE_FOCUSPOND_BASE_URL environment variables. Ensure SUPABASE_FOCUSPOND_SERVICE_ROLE_KEY is set only on the server."
  );
}

// Option A: reuse a singleton on the server (safe in most serverless environments)
let _serviceClient: SupabaseClient | null = null;

export const getServiceSupabase = (): SupabaseClient => {
  if (!_serviceClient) {
    _serviceClient = createClient(url, serviceRoleKey, {
      // Example server options (adjust if needed)
      auth: { persistSession: false },
    });
  }
  return _serviceClient;
};

// Option B: if you prefer a new client per-call, use this instead:
// export const createServiceSupabase = (): SupabaseClient =>
//   createClient(url, serviceRoleKey);
