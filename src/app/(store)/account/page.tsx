
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";

function AccountLoading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="section-container py-12 md:py-16">
        <div className="animate-pulse">
          <div className="h-3 w-24 bg-border" />
          <div className="mt-5 h-10 w-64 bg-border" />
          <div className="mt-3 h-4 w-80 max-w-full bg-border" />

          <div className="mt-10 grid gap-6 md:grid-cols-[280px_1fr]">
            <div className="h-52 bg-border" />
            <div className="h-72 bg-border" />
          </div>
        </div>
      </section>
    </main>
  );
}

async function AccountContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="section-container py-12 md:py-16">
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] text-muted">
            MY ACCOUNT
          </p>

          <h1 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            Welcome, {user.name}
          </h1>

          <p className="mt-2 text-sm text-muted">
            Manage your account and keep track of your jewellery purchases.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <aside className="h-fit border border-border p-6">
            <div className="border-b border-border pb-5">
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="mt-1 break-all text-sm text-muted">
                {user.email}
              </p>
            </div>

            <nav className="mt-4 flex flex-col gap-4 text-sm">
              <Link href="/account" className="text-primary">
                Account overview
              </Link>
              <Link href="/wishlist" className="hover:text-primary">
                My Wishlist
              </Link>
              <Link href="/cart" className="hover:text-primary">
                Shopping Bag
              </Link>
            </nav>
          </aside>

          <section className="border border-border p-6 md:p-8">
            <h2 className="font-serif text-2xl text-primary">
              Account Overview
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Your account is active. You can use this area to manage your
              profile, orders, addresses and saved jewellery.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="border border-border p-5">
                <p className="text-xs tracking-wider text-muted">
                  CUSTOMER NAME
                </p>
                <p className="mt-2 text-sm font-medium">{user.name}</p>
              </div>

              <div className="border border-border p-5">
                <p className="text-xs tracking-wider text-muted">
                  EMAIL ADDRESS
                </p>
                <p className="mt-2 break-all text-sm font-medium">
                  {user.email}
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoading />}>
      <AccountContent />
    </Suspense>
  );
}
