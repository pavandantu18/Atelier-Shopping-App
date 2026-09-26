import "server-only";

type ServerEnvName = "DATABASE_URL" | "BETTER_AUTH_SECRET" | "BETTER_AUTH_URL";

// Read on demand so builds and the blank root page do not need credentials.
export function requireEnv(name: ServerEnvName): string {
  const value = process.env[name];

  if (!value?.trim()) {
    throw new Error(`Missing ${name}. Configure it in .env.local.`);
  }

  return value;
}
