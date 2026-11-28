
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Gem } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password.length > 128) {
      setError("Password cannot exceed 128 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Registration failed. Please try again.");
        return;
      }

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Unable to connect to the server. Please try again.");
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
              Jewellery that tells your story.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/90">
              Discover beautiful designs crafted to celebrate every
              moment that matters.
            </p>
          </div>
        </section>

        {/* Right - Signup Form */}
        <section className="flex items-center justify-center px-6 py-14 sm:px-12 lg:px-20">
          <div className="w-full max-w-md">

            <div className="mb-9 text-center">
              <div className="mb-5 flex justify-center">
                <Gem size={30} strokeWidth={1.2} className="text-primary" />
              </div>

              <p className="mb-3 text-[10px] tracking-[0.3em] text-muted">
                JOIN OUR WORLD
              </p>

              <h1 className="font-serif text-4xl text-foreground">
                Create Account
              </h1>

              <p className="mt-3 text-sm text-muted">
                Create an account and discover timeless elegance.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              aria-busy={isLoading}
            >

              <div>
                <label htmlFor="name" className="text-xs font-medium">
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                  maxLength={80}
                  value={form.name}
                  disabled={isLoading}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

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
                  value={form.email}
                  disabled={isLoading}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="password" className="text-xs font-medium">
                  Password
                </label>

                <div className="flex items-center border-b border-border focus-within:border-primary">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    required
                    minLength={8}
                    maxLength={128}
                    value={form.password}
                    disabled={isLoading}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="px-2 text-muted hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="mt-2 text-[11px] text-muted">
                  Use at least 8 characters.
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-xs font-medium">
                  Confirm Password
                </label>

                <div className="flex items-center border-b border-border focus-within:border-primary">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    required
                    value={form.confirmPassword}
                    disabled={isLoading}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="px-2 text-muted hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="text-xs text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-xs tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                {!isLoading && <ArrowRight size={16} />}
              </button>

            </form>

            <p className="mt-8 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-8 text-center text-[10px] leading-5 text-muted">
              By creating an account, you agree to our Terms of Service
              and Privacy Policy.
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}
