
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Gem } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresVerification && data.email) {
          router.push(
            `/verify-email?email=${encodeURIComponent(data.email)}`
          );
          return;
        }

        setMessage(data.message || "Unable to sign in. Please try again.");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    "w-full border-b border-border bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary";

  return (
    <main className="min-h-[calc(100vh-80px)] bg-background">
      <div className="mx-auto grid min-h-700px max-w-7xl md:grid-cols-2">

        {/* Left - Brand Panel */}
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
              Welcome back to elegance.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/90">
              Your favourite designs and timeless pieces are just a
              moment away.
            </p>
          </div>
        </section>

        {/* Right - Login Form */}
        <section className="flex items-center justify-center px-6 py-14 sm:px-12 lg:px-20">
          <div className="w-full max-w-md">

            <div className="mb-10 text-center">
              <div className="mb-5 flex justify-center">
                <Gem
                  size={30}
                  strokeWidth={1.2}
                  className="text-primary"
                />
              </div>

              <p className="mb-3 text-[10px] tracking-[0.3em] text-muted">
                WELCOME BACK
              </p>

              <h1 className="font-serif text-4xl text-foreground">
                Sign In
              </h1>

              <p className="mt-3 text-sm text-muted">
                Sign in to continue your journey with us.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Email */}
              <div>
                <label htmlFor="email" className="text-xs font-medium">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  required
                  maxLength={254}
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="text-xs font-medium">
                  Password
                </label>

                <div className="flex items-center border-b border-border focus-within:border-primary">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    disabled={isLoading}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="px-2 text-muted hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me / Forgot Password */}
              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="accent-primary"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Message */}
              {message && (
                <p role="alert" className="text-xs text-red-600">
                  {message}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-xs tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "SIGNING IN..." : "SIGN IN"}
                {!isLoading && <ArrowRight size={16} />}
              </button>

            </form>

            {/* Register Link */}
            <p className="mt-9 text-center text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary underline underline-offset-4"
              >
                Create Account
              </Link>
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}
