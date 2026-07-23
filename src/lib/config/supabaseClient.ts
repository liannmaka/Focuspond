// lib/config/supabaseClient.ts
// Browser-safe Supabase client (anon key). Env values are validated centrally
// in `@/lib/env`, so a missing/invalid var fails fast with a clear message.

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { clientEnv } from "@/lib/env";

// Single shared client instance for the browser.
export const supabase: SupabaseClient = createClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_FOCUSPOND_BASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_FOCUSPOND_ANON_KEY
);
