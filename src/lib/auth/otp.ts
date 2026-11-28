
import "server-only";

import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

const OTP_DURATION_MINUTES = 10;

function getOtpSecret(): string {
  const secret = process.env.OTP_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("OTP_SECRET must contain at least 32 characters.");
  }

  return secret;
}

export function generateOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOtp(
  otp: string,
  destination: string,
  purpose: string
): string {
  return createHmac("sha256", getOtpSecret())
    .update(`${destination.toLowerCase()}:${purpose}:${otp}`)
    .digest("hex");
}

export function verifyOtpHash(
  otp: string,
  destination: string,
  purpose: string,
  storedHash: string
): boolean {
  const actual = Buffer.from(
    hashOtp(otp, destination, purpose),
    "hex"
  );

  const expected = Buffer.from(storedHash, "hex");

  return (
    actual.length === expected.length &&
    timingSafeEqual(actual, expected)
  );
}

export const OTP_DURATION_MS = OTP_DURATION_MINUTES * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
