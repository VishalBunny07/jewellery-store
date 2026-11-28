import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const SESSION_COOKIE_NAME = "jewellery_session";
export const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60;
const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000;

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CreatedSession {
  token: string;
  expiresAt: Date;
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Create a random opaque session token; only its SHA-256 hash is stored in PostgreSQL. */
export async function createSession(userId: number): Promise<CreatedSession> {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.query(
    `INSERT INTO "Session" ("userId", "tokenHash", "expiresAt", "createdAt")
     VALUES ($1, $2, $3, NOW())`,
    [userId, tokenHash, expiresAt]
  );

  return { token, expiresAt };
}

/** Set the session cookie after a successful login or registration verification. */
export async function setSessionCookie(session: CreatedSession): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expiresAt,
    maxAge: SESSION_DURATION_SECONDS,
  });
}

/** Return the authenticated customer for the current request, or null. */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const result = await db.query<AuthenticatedUser>(
    `SELECT u."id", u."name", u."email", u."role"
     FROM "Session" s
     INNER JOIN "User" u ON u."id" = s."userId"
     WHERE s."tokenHash" = $1
       AND s."revokedAt" IS NULL
       AND s."expiresAt" > NOW()
       AND u."status" = 'ACTIVE'
       AND u."emailVerified" = TRUE
     LIMIT 1`,
    [tokenHash]
  );

  return result.rows[0] ?? null;
}

/** Revoke the current session and remove its browser cookie. */
export async function revokeCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await db.query(
      `UPDATE "Session"
       SET "revokedAt" = NOW()
       WHERE "tokenHash" = $1 AND "revokedAt" IS NULL`,
      [hashSessionToken(token)]
    );
  }

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}
