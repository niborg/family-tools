"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm font-medium">
        Password
        <input
          autoComplete="current-password"
          autoFocus
          className="rounded-lg border border-(--line) bg-white px-3 py-2.5 text-base font-normal outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20"
          name="password"
          required
          type="password"
        />
      </label>
      {state?.error ? (
        <p className="text-sm text-(--danger)" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        className="rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-semibold text-white hover:bg-(--accent-hover) disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
