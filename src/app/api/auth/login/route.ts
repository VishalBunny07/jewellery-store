
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  setSessionCookie,
} from "@/lib/auth/session";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

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

    const password =
      typeof data.password === "string" ? data.password : "";

    if (
      !EMAIL_REGEX.test(email) ||
      email.length > 254 ||
      !password ||
      password.length > 128
    ) {
      return NextResponse.json(
        { message: "Please enter a valid email and password." },
        { status: 400 }
      );
    }

    const result = await db.query(
      `SELECT "id", "name", "email", "passwordHash",
              "emailVerified", "status"
       FROM "User"
       WHERE "email" = $1
       LIMIT 1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { message: "Your account is currently inactive. Please contact support." },
        { status: 403 }
      );
    }

    const passwordMatches = await verifyPassword(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          message: "Please verify your email address before signing in.",
          requiresVerification: true,
          email: user.email,
        },
        { status: 403 }
      );
    }

    const session = await createSession(user.id);
    await setSessionCookie(session);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);

    return NextResponse.json(
      { message: "Unable to sign in. Please try again later." },
      { status: 500 }
    );
  }
}
