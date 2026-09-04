import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-(--line) bg-(--card) p-8 shadow-sm">
        <p className="text-sm font-medium tracking-wide text-(--muted) uppercase">
          knipe.io
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tools</h1>
        <p className="mt-2 mb-6 text-(--muted)">
          Enter the shared password to continue.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
