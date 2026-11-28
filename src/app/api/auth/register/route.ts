
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import {
  generateOtp,
  hashOtp,
  OTP_DURATION_MS,
} from "@/lib/auth/otp";
import { sendVerificationEmail } from "@/lib/email";

// export const runtime = "nodejs";

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

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const password =
    typeof data.password === "string" ? data.password : "";

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { message: "Name must contain between 2 and 80 characters." },
      { status: 400 }
    );
  }

  if (email.length > 254 || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (password.length < 8 || password.length > 128) {
    return NextResponse.json(
      { message: "Password must contain between 8 and 128 characters." },
      { status: 400 }
    );
  }

  let client;

  try {
    const passwordHash = await hashPassword(password);
    const otp = generateOtp();
    const otpHash = hashOtp(otp, email, "EMAIL_VERIFICATION");

    const expiresAt = new Date(Date.now() + OTP_DURATION_MS);

    client = await db.connect();

    await client.query("BEGIN");

    // Check for an existing account.
    const existingUser = await client.query(
      `SELECT "id", "emailVerified"
       FROM "User"
       WHERE "email" = $1
       LIMIT 1`,
      [email]
    );

    if (existingUser.rowCount && existingUser.rowCount > 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { message: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    // Create an unverified customer account.
    const userResult = await client.query(
      `INSERT INTO "User"
        ("name", "email", "passwordHash", "role", "status", "emailVerified", "phoneVerified", "createdAt", "updatedAt")
       VALUES
        ($1, $2, $3, 'CUSTOMER', 'ACTIVE', FALSE, FALSE, NOW(), NOW())
       RETURNING "id", "name", "email"`,
      [name, email, passwordHash]
    );

    const user = userResult.rows[0];

    // Invalidate any previous unused verification OTP.
    await client.query(
      `UPDATE "OtpVerification"
       SET "consumedAt" = NOW()
       WHERE "destination" = $1
         AND "purpose" = 'EMAIL_VERIFICATION'
         AND "consumedAt" IS NULL`,
      [email]
    );

    // Store the hashed OTP.
    await client.query(
      `INSERT INTO "OtpVerification"
        ("userId", "destination", "otpHash", "purpose", "expiresAt", "attempts", "createdAt")
       VALUES
        ($1, $2, $3, 'EMAIL_VERIFICATION', $4, 0, NOW())`,
      [user.id, email, otpHash, expiresAt]
    );

    // Send the verification email before committing.
    await sendVerificationEmail(email, name, otp);

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        message: "Account created. Please check your email for the verification code.",
        email,
      },
      { status: 201 }
    );
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original error.
      }
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Unable to complete registration. Please try again later." },
      { status: 500 }
    );
  } finally {
    client?.release();
  }
}
