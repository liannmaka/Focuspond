// lib/config/supabaseServer.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { clientEnv, getServerEnv } from "@/lib/env";

/**
 * Server-only factory for a Supabase client using the service role key.
 * IMPORTANT: Never expose SUPABASE_FOCUSPOND_SERVICE_ROLE_KEY to the browser.
 * `getServerEnv()` throws if this ever runs on the client.
 *
 * Usage:
 *   const supabase = getServiceSupabase();
 *   const { data, error } = await supabase.from('table').select('*');
 */

// Reuse a singleton on the server (safe in most serverless environments).
let _serviceClient: SupabaseClient | null = null;

export const getServiceSupabase = (): SupabaseClient => {
  if (!_serviceClient) {
    _serviceClient = createClient(
      clientEnv.NEXT_PUBLIC_SUPABASE_FOCUSPOND_BASE_URL,
      getServerEnv().SUPABASE_FOCUSPOND_SERVICE_ROLE_KEY,
      {
        auth: { persistSession: false },
      }
    );
  }
  return _serviceClient;
};
