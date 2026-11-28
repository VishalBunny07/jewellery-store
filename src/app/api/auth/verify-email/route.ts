import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyOtpHash,
  OTP_MAX_ATTEMPTS,
} from "@/lib/auth/otp";
import {
  createSession,
  setSessionCookie,
} from "@/lib/auth/session";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  const data = body as Record<string, unknown>;

  const email =
    typeof data.email === "string"
      ? data.email.trim().toLowerCase()
      : "";

  const otp =
    typeof data.otp === "string" ? data.otp.trim() : "";

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json(
      { message: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  if (!/^\d{6}$/.test(otp)) {
    return NextResponse.json(
      { message: "Please enter a valid 6-digit verification code." },
      { status: 400 }
    );
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Lock the customer record during verification.
    const userResult = await client.query(
      `SELECT "id", "name", "emailVerified", "status"
       FROM "User"
       WHERE "email" = $1
       LIMIT 1
       FOR UPDATE`,
      [email]
    );

    if (userResult.rowCount === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { message: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    const user = userResult.rows[0];

    if (user.status !== "ACTIVE") {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { message: "This account is not active." },
        { status: 403 }
      );
    }

    if (user.emailVerified) {
      await client.query("COMMIT");

      return NextResponse.json(
        { message: "This email address is already verified." },
        { status: 200 }
      );
    }

    // Lock the latest unused OTP.
    const otpResult = await client.query(
      `SELECT "id", "otpHash", "expiresAt", "attempts"
       FROM "OtpVerification"
       WHERE "userId" = $1
         AND "destination" = $2
         AND "purpose" = 'EMAIL_VERIFICATION'
         AND "consumedAt" IS NULL
       ORDER BY "createdAt" DESC
       LIMIT 1
       FOR UPDATE`,
      [user.id, email]
    );

    if (otpResult.rowCount === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { message: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    const verification = otpResult.rows[0];

    if (new Date(verification.expiresAt).getTime() <= Date.now()) {
      await client.query(
        `UPDATE "OtpVerification"
         SET "consumedAt" = NOW()
         WHERE "id" = $1`,
        [verification.id]
      );

      await client.query("COMMIT");

      return NextResponse.json(
        { message: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (verification.attempts >= OTP_MAX_ATTEMPTS) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { message: "Too many incorrect attempts. Please request a new code." },
        { status: 429 }
      );
    }

    const isValid = verifyOtpHash(
      otp,
      email,
      "EMAIL_VERIFICATION",
      verification.otpHash
    );

    if (!isValid) {
      const nextAttempts = verification.attempts + 1;

      await client.query(
        `UPDATE "OtpVerification"
         SET "attempts" = $1,
             "consumedAt" = CASE
               WHEN $1 >= $2 THEN NOW()
               ELSE "consumedAt"
             END
         WHERE "id" = $3`,
        [nextAttempts, OTP_MAX_ATTEMPTS, verification.id]
      );

      await client.query("COMMIT");

      return NextResponse.json(
        {
          message:
            nextAttempts >= OTP_MAX_ATTEMPTS
              ? "Too many incorrect attempts. Please request a new code."
              : `Incorrect verification code. ${OTP_MAX_ATTEMPTS - nextAttempts} attempts remaining.`,
        },
        { status: 400 }
      );
    }

    // Consume the OTP and verify the customer.
    await client.query(
      `UPDATE "OtpVerification"
       SET "consumedAt" = NOW()
       WHERE "id" = $1`,
      [verification.id]
    );

    await client.query(
      `UPDATE "User"
       SET "emailVerified" = TRUE,
           "updatedAt" = NOW()
       WHERE "id" = $1`,
      [user.id]
    );

    await client.query("COMMIT");

    // Create the login session only after successful verification.
    const session = await createSession(user.id);
    await setSessionCookie(session);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the original error.
    }

    console.error("Email verification error:", error);

    return NextResponse.json(
      { message: "Unable to verify email. Please try again later." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
