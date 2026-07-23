import { z } from "zod";

/**
 * Centralised, type-safe environment access.
 *
 * - `clientEnv` holds NEXT_PUBLIC_* values and is safe to import anywhere
 *   (browser or server). Each value is read via a literal `process.env.X`
 *   access so Next.js can statically inline it into the client bundle.
 * - `getServerEnv()` reads server-only secrets and refuses to run on the
 *   client, so a secret can never leak into a browser bundle.
 *
 * Missing/invalid values fail fast with a readable message instead of
 * surfacing as a cryptic error deep inside a request.
 */

function parseEnv<T extends z.ZodType>(
  schema: T,
  values: Record<string, unknown>,
  scope: string
): z.infer<T> {
  const result = schema.safeParse(values);
  if (!result.success) {
    const issues = result.error.issues
      .map(
        (issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`
      )
      .join("\n");
    throw new Error(
      `Invalid ${scope} environment variables:\n${issues}\n\nSee .env.example for the expected values.`
    );
  }
  return result.data;
}

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_FOCUSPOND_BASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_FOCUSPOND_ANON_KEY: z.string().min(1),
});

export const clientEnv = parseEnv(
  clientSchema,
  {
    NEXT_PUBLIC_SUPABASE_FOCUSPOND_BASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_FOCUSPOND_BASE_URL,
    NEXT_PUBLIC_SUPABASE_FOCUSPOND_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_FOCUSPOND_ANON_KEY,
  },
  "client"
);

const serverSchema = z.object({
  SUPABASE_FOCUSPOND_SERVICE_ROLE_KEY: z.string().min(1),
});

type ServerEnv = z.infer<typeof serverSchema>;

let cachedServerEnv: ServerEnv | null = null;

/**
 * Server-only environment. Throws if called from the browser so the
 * service-role key never ends up in a client bundle. Validated lazily on
 * first use (keeps module imports side-effect free on the server).
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error(
      "getServerEnv() was called on the client. Server secrets must stay on the server."
    );
  }
  if (!cachedServerEnv) {
    cachedServerEnv = parseEnv(
      serverSchema,
      {
        SUPABASE_FOCUSPOND_SERVICE_ROLE_KEY:
          process.env.SUPABASE_FOCUSPOND_SERVICE_ROLE_KEY,
      },
      "server"
    );
  }
  return cachedServerEnv;
}
