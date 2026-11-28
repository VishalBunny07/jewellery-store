
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  hashSessionToken,
} from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const result = await db.query(
      `SELECT u."id", u."name", u."email"
       FROM "Session" s
       INNER JOIN "User" u ON u."id" = s."userId"
       WHERE s."tokenHash" = $1
         AND s."revokedAt" IS NULL
         AND s."expiresAt" > NOW()
         AND u."status" = 'ACTIVE'
         AND u."emailVerified" = TRUE
       LIMIT 1`,
      [hashSessionToken(token)]
    );

    const user = result.rows[0] ?? null;

    return NextResponse.json(
      {
        authenticated: Boolean(user),
        user,
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("Auth status error:", error);

    return NextResponse.json(
      { message: "Unable to check authentication status." },
      { status: 500 }
    );
  }
}
