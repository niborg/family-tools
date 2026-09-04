import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { RanchFrame } from "@/app/ranch-frame";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/");
  }

  return (
    <RanchFrame compact>
      <main className="ranch-sign relative mx-auto w-full max-w-md p-8">
        <span className="sparkle top-3 left-4">✨</span>
        <span className="sparkle right-6 bottom-4">⭐</span>
        <p className="text-center font-pixel text-lg text-[#3d1f0a]">
          knipe.io homestead
        </p>
        <h1 className="ranch-title mt-2 text-center text-4xl">
          <span className="bounce-slow" aria-hidden>
            🤠
          </span>
          <br />
          Ranch Gate
        </h1>
        <p className="mt-3 mb-6 text-center font-comic font-bold text-[#5c3317]">
          The tool shed is locked. Enter the family password, partner.
        </p>
        <LoginForm />
        <p className="mt-5 text-center font-pixel text-sm text-[#3d1f0a]">
          <span className="blink">★</span> members only · no rustlers{" "}
          <span className="blink">★</span>
        </p>
      </main>
    </RanchFrame>
  );
}
