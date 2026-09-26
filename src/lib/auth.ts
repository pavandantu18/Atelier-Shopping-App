import "server-only";

import { betterAuth } from "better-auth";
import { getDatabase } from "@/lib/db";
import { requireEnv } from "@/lib/env";

function createAuth() {
  const secret = requireEnv("BETTER_AUTH_SECRET");

  if (secret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must contain at least 32 characters.");
  }

  return betterAuth({
    appName: "Atelier",
    baseURL: requireEnv("BETTER_AUTH_URL"),
    secret,
    database: getDatabase(),
    // Authentication methods and database schemas are intentionally deferred.
  });
}

let auth: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  return (auth ??= createAuth());
}
