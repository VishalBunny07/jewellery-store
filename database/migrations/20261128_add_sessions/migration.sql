-- Customer authentication sessions.
-- Safe to run more than once. Existing User, Address and OtpVerification data is untouched.

CREATE TABLE IF NOT EXISTS "Session" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "revokedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Session_tokenHash_key"
  ON "Session"("tokenHash");

CREATE INDEX IF NOT EXISTS "Session_userId_expiresAt_idx"
  ON "Session"("userId", "expiresAt");

CREATE INDEX IF NOT EXISTS "Session_expiresAt_idx"
  ON "Session"("expiresAt");
