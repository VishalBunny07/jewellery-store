import { NextResponse } from "next/server";
import { revokeCurrentSession } from "@/lib/auth/session";

export async function POST() {
  try {
    await revokeCurrentSession();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout API error:", error);

    return NextResponse.json(
      { message: "Unable to log out. Please try again." },
      { status: 500 }
    );
  }
}