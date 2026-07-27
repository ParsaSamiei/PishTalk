import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";

// Precomputed once so `authorize` can always await a bcrypt compare of the
// same cost, even when no admin row exists for the given email — otherwise
// an unknown email returns near-instantly while a known one takes as long
// as a real bcrypt comparison, letting an attacker enumerate valid admin
// emails purely from response time.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("not-a-real-password", 10);

const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

/**
 * Admin-only authentication (docs/07_ADMIN_PANEL.md: "Auth: Simple email +
 * password... no public signup, admins are created manually or seeded").
 * There is no public registration route by design.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  // Required for self-hosted deployments behind a reverse proxy (Nginx,
  // Docker). Auth.js only trusts the incoming Host header automatically on
  // Vercel or in dev; otherwise it rejects requests as an "untrusted host"
  // and, in production, masks that behind the generic server-config error
  // page — the same one AUTH_SECRET being missing produces.
  trustHost: true,
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "ایمیل", type: "email" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") return null;

        // Rate-limit per email rather than per IP: the login form doesn't
        // have easy access to the caller's IP here, and since there is a
        // small, fixed set of admin accounts, limiting attempts per email
        // still meaningfully blocks credential-stuffing against them.
        const rateLimit = checkRateLimit(`login:${email.toLowerCase()}`, LOGIN_ATTEMPT_LIMIT, LOGIN_WINDOW_MS);
        if (!rateLimit.allowed) return null;

        const admin = await prisma.admin.findFirst({
          where: { email, deletedAt: null },
        });

        const isValid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_PASSWORD_HASH);
        if (!admin || !isValid) return null;

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
});
