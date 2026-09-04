"use server";

import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  passwordMatches,
  setSessionCookie,
  sitePasswordConfigured,
} from "@/lib/auth";

export type LoginState = {
  error: string;
};

export async function login(
  _prev: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  if (!sitePasswordConfigured()) {
    return { error: "This site isn't configured yet." };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !passwordMatches(password)) {
    return { error: "That password didn't work. Try again." };
  }

  await setSessionCookie();
  redirect("/");
}

export async function logout(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
