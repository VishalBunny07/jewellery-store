
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  generateOtp,
  hashOtp,
  OTP_DURATION_MS,
} from "@/lib/auth/otp";
import { sendVerificationEmail } from "@/lib/email";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_SECONDS = 30;

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

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json(
      { message: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Lock the customer record to prevent simultaneous resend requests.
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
        { message: "Unable to resend verification code. Please check your registration." },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    if (user.status !== "ACTIVE" || user.emailVerified) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { message: "This account does not require email verification." },
        { status: 400 }
      );
    }

    // Check when the previous OTP was created.
    const latestOtpResult = await client.query(
      `SELECT "createdAt"
       FROM "OtpVerification"
       WHERE "userId" = $1
         AND "purpose" = 'EMAIL_VERIFICATION'
       ORDER BY "createdAt" DESC
       LIMIT 1`,
      [user.id]
    );

    if (latestOtpResult.rowCount && latestOtpResult.rowCount > 0) {
      const createdAt = new Date(
        latestOtpResult.rows[0].createdAt
      ).getTime();

      const elapsedSeconds = Math.floor(
        (Date.now() - createdAt) / 1000
      );

      if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
        const remainingSeconds =
          RESEND_COOLDOWN_SECONDS - elapsedSeconds;

        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            message: `Please wait ${remainingSeconds} seconds before requesting another code.`,
            remainingSeconds,
          },
          { status: 429 }
        );
      }
    }

    const otp = generateOtp();
    const otpHash = hashOtp(
      otp,
      email,
      "EMAIL_VERIFICATION"
    );

    const expiresAt = new Date(Date.now() + OTP_DURATION_MS);

    // Invalidate previous unused verification codes.
    await client.query(
      `UPDATE "OtpVerification"
       SET "consumedAt" = NOW()
       WHERE "userId" = $1
         AND "purpose" = 'EMAIL_VERIFICATION'
         AND "consumedAt" IS NULL`,
      [user.id]
    );

    // Store the new hashed OTP.
    await client.query(
      `INSERT INTO "OtpVerification"
       ("userId", "destination", "otpHash", "purpose", "expiresAt", "attempts", "createdAt")
       VALUES ($1, $2, $3, 'EMAIL_VERIFICATION', $4, 0, NOW())`,
      [user.id, email, otpHash, expiresAt]
    );

    // Send the new code before committing the transaction.
    await sendVerificationEmail(email, user.name, otp);

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the original error.
    }

    console.error("Resend OTP error:", error);

    return NextResponse.json(
      { message: "Unable to resend verification code. Please try again later." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
