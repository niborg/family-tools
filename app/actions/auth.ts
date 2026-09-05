"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  passwordMatches,
  setSessionCookie,
  sitePasswordConfigured,
} from "@/lib/auth";
import {
  LOGIN_RATE_LIMITED_MESSAGE,
  clearFailedLogins,
  getLoginRateLimiter,
  isLoginRateLimited,
  loginClientKey,
  recordFailedLogin,
} from "@/lib/login-rate-limit";
import { safeInternalPath } from "@/lib/paths";

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

  const key = loginClientKey(await headers());
  if (isLoginRateLimited(key)) {
    return { error: LOGIN_RATE_LIMITED_MESSAGE };
  }

  const limiter = await getLoginRateLimiter();
  if (limiter) {
    const { success } = await limiter.limit({ key });
    if (!success) {
      return { error: LOGIN_RATE_LIMITED_MESSAGE };
    }
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !passwordMatches(password)) {
    recordFailedLogin(key);
    return { error: "That password didn't work. Try again." };
  }

  clearFailedLogins(key);
  await setSessionCookie();
  redirect(safeInternalPath(formData.get("next")));
}

export async function logout(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
