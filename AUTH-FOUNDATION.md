# Authentication foundation

This change prepares the project for email/password customer authentication with email OTP verification and 30-day sessions.

## Included

- `Session` model added to `database/schema/contract.prisma`.
- Idempotent PostgreSQL SQL migration in `database/migrations/20261128_add_sessions/migration.sql`.
- Shared server-only PostgreSQL pool in `src/lib/db.ts`.
- Node.js scrypt password hash/verify helpers in `src/lib/auth/password.ts`.
- Opaque 256-bit session tokens, SHA-256 token storage, 30-day HTTP-only cookie handling, current-user lookup, and session revocation in `src/lib/auth/session.ts`.
- SMTP environment variable placeholders in `.env.example`.

## Important security behavior

- Passwords are never stored in plaintext. `passwordHash` stores a salted scrypt hash.
- Session tokens are random and only their SHA-256 hashes are stored in PostgreSQL.
- Session cookies are HTTP-only, SameSite=Lax, Secure in production, and expire after 30 days.
- `getCurrentUser()` only returns active users whose email is verified.
- OTP sending/verification, registration, login/logout API routes, rate limiting, and UI are intentionally not included yet. They are the next implementation stage.

## Apply safely

1. Back up the target PostgreSQL database.
2. Confirm `.env` points to the intended development database.
3. Apply `database/migrations/20261128_add_sessions/migration.sql` to that database.
4. Run `npm run contract:emit` to regenerate `database/schema/contract.json` and `database/schema/contract.d.ts` from the updated Prisma contract.
5. Run `npx tsc --noEmit` and `npm run build`.

Do not commit `.env` or real SMTP credentials. SMTP configuration is only documented here; mail delivery is not active until the email service is implemented.
