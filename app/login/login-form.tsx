"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 font-comic text-sm font-bold">
        Secret handshake (password)
        <input
          autoComplete="current-password"
          autoFocus
          className="ranch-input px-3 py-2.5 text-base font-normal"
          name="password"
          required
          type="password"
        />
      </label>
      {state?.error ? (
        <p className="font-comic text-sm font-bold text-(--danger)" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="ranch-btn px-4 py-2.5" disabled={pending} type="submit">
        {pending ? "Checking the brand…" : "Saddle up"}
      </button>
    </form>
  );
}
