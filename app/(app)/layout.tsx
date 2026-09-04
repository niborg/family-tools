import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { isAuthenticated } from "@/lib/auth";
import { RanchFrame } from "@/app/ranch-frame";

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
    <RanchFrame>
      <header className="ranch-sign relative mb-8 overflow-hidden px-5 py-4">
        <span className="sparkle top-2 left-3">✨</span>
        <span className="sparkle bottom-2 left-16">⭐</span>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-pixel text-lg tracking-wide text-[#3d1f0a]">
              knipe.io homestead
            </p>
            <h1 className="ranch-title mt-1 text-3xl sm:text-4xl">
              <Link className="text-[#3d1f0a] no-underline hover:text-[#c44512]" href="/">
                <span className="bounce-slow mr-2" aria-hidden>
                  🤠
                </span>
                The Tool Shed
              </Link>
            </h1>
            <p className="mt-1 font-comic text-sm font-bold text-[#5c3317]">
              family ranch · dusty · slightly haunted
            </p>
          </div>
          <form action={logout}>
            <button className="ranch-btn-ghost px-3 py-1.5 text-sm" type="submit">
              Ride off
            </button>
          </form>
        </div>
      </header>
      {children}
    </RanchFrame>
  );
}
