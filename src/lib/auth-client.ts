"use client";

import { createAuthClient } from "better-auth/react";

// Uses the current origin and the default /api/auth path.
export const authClient = createAuthClient();
