import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6 py-8">
      <header className="mb-10 flex items-center justify-between gap-4 border-b border-(--line) pb-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-(--muted) uppercase">
            knipe.io
          </p>
          <h1 className="text-xl font-semibold tracking-tight">
            <Link className="hover:text-(--accent)" href="/">
              Tools
            </Link>
          </h1>
        </div>
        <form action={logout}>
          <button
            className="rounded-lg border border-(--line) bg-(--card) px-3 py-1.5 text-sm font-medium hover:bg-white"
            type="submit"
          >
            Log out
          </button>
        </form>
      </header>
      {children}
    </div>
  );
}
