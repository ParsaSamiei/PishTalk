import "server-only";

import { auth } from "@/lib/auth";

/**
 * Server actions are callable directly over the network regardless of which
 * page rendered them, so middleware alone isn't enough — every admin
 * mutation must re-check the session itself.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
