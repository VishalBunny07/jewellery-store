
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Gem, Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={<main className="min-h-screen bg-background" />}
    >
      <VerifyEmailForm />
    </Suspense>
  );
}

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email")?.trim().toLowerCase() || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const canResend = countdown === 0;
  const isBusy = isVerifying || isResending;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function showMessage(
    text: string,
    type: "error" | "success" = "error"
  ) {
    setMessage(text);
    setMessageType(type);
  }

  // OTP input handling
  function handleChange(value: string, index: number) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updatedOtp = [...otp];

    updatedOtp[index] = digit;
    setOtp(updatedOtp);
    setMessage("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // Backspace navigation
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  // Paste complete OTP
  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const updatedOtp = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);
    setMessage("");

    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  // Verify OTP
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const enteredOtp = otp.join("");

    if (!email) {
      showMessage("Email address is missing. Please register again.");
      return;
    }

    if (enteredOtp.length !== 6) {
      showMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setIsVerifying(true);

      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.error || "Invalid or expired verification code."
        );
        return;
      }

      showMessage(
        "Email verified successfully! Redirecting...",
        "success"
      );

      router.push("/");
      router.refresh();
    } catch {
      showMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  // Resend OTP
  async function handleResend() {
    if (!canResend || isBusy) return;

    if (!email) {
      showMessage("Email address is missing. Please register again.");
      return;
    }

    try {
      setIsResending(true);
      setMessage("");

      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Unable to resend OTP.");
        return;
      }

      setOtp(["", "", "", "", "", ""]);
      setCountdown(30);

      showMessage(
        "A new verification code has been sent.",
        "success"
      );

      inputRefs.current[0]?.focus();
    } catch {
      showMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  // Countdown timer
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-background">
      <div className="mx-auto grid min-h-700px max-w-7xl md:grid-cols-2">

        {/* Brand Panel */}
        <section className="relative hidden overflow-hidden bg-[#e9e0d4] md:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/images/reference-giva/categories/rings/ring-01.webp')",
            }}
          />

          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute inset-x-0 bottom-0 p-12 text-white">
            <p className="mb-4 text-xs tracking-[0.3em]">
              TIMELESS ELEGANCE
            </p>

            <h2 className="max-w-md font-serif text-5xl leading-tight">
              Every detail matters.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/90">
              A little verification keeps your account and shopping
              experience secure.
            </p>
          </div>
        </section>

        {/* Verification Form */}
        <section className="flex items-center justify-center px-6 py-14 sm:px-12 lg:px-20">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-9 text-center">
              <div className="mb-5 flex justify-center">
                <Gem
                  size={30}
                  strokeWidth={1.2}
                  className="text-primary"
                />
              </div>

              <p className="mb-3 text-[10px] tracking-[0.3em] text-muted">
                ACCOUNT VERIFICATION
              </p>

              <h1 className="font-serif text-4xl text-foreground">
                Verify Your Email
              </h1>

              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted">
                We&apos;ve sent a 6-digit verification code to your email
                address.
              </p>
            </div>

            {/* Email Display */}
            <div className="mb-8 flex items-center justify-center gap-3 rounded-sm bg-secondary/50 px-4 py-4">
              <Mail size={18} className="text-primary" />

              <span className="min-w-0 truncate text-sm font-medium">
                {email || "Email address missing"}
              </span>

              <Link
                href="/register"
                className="ml-auto shrink-0 text-xs text-primary underline underline-offset-4"
              >
                Change
              </Link>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit}>
              <label className="mb-4 block text-center text-xs font-medium">
                Enter Verification Code
              </label>

              <div className="mb-7 flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    disabled={isBusy || !email}
                    onChange={(e) =>
                      handleChange(e.target.value, index)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(e, index)
                    }
                    onPaste={handlePaste}
                    aria-label={`Verification digit ${index + 1}`}
                    className="h-12 w-10 rounded-sm border border-border bg-transparent text-center text-lg font-medium outline-none transition-colors focus:border-primary disabled:opacity-50 sm:h-14 sm:w-12"
                  />
                ))}
              </div>

              {message && (
                <p
                  role="status"
                  className={`mb-5 text-center text-xs ${
                    messageType === "success"
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={isBusy || !email}
                className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-xs tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVerifying ? "VERIFYING..." : "VERIFY EMAIL"}

                {!isVerifying && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted">
                Didn&apos;t receive the code?
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || isBusy || !email}
                className="mt-2 text-xs font-medium text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending
                  ? "SENDING..."
                  : canResend
                    ? "Resend OTP"
                    : `Resend available in ${countdown}s`}
              </button>
            </div>

            {/* Back Link */}
            <div className="mt-9 text-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-primary"
              >
                <ArrowLeft size={14} />
                Back to Create Account
              </Link>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
