import { getCloudflareContext } from "@opennextjs/cloudflare";

export const LOGIN_MAX_FAILURES = 5;
export const LOGIN_LOCKOUT_MS = 15 * 60 * 1000;
export const LOGIN_RATE_LIMITED_MESSAGE =
  "Too many tries. Wait a few minutes.";

type AttemptWindow = {
  count: number;
  resetAt: number;
};

const failures = new Map<string, AttemptWindow>();

export type LoginRateLimiter = {
  limit(options: { key: string }): Promise<{ success: boolean }>;
};

function asLoginRateLimiter(value: unknown): LoginRateLimiter | undefined {
  if (
    value &&
    typeof value === "object" &&
    "limit" in value &&
    typeof value.limit === "function"
  ) {
    return value as LoginRateLimiter;
  }
  return undefined;
}

export function loginClientKey(headerList: Headers): string {
  const cfIp = headerList.get("cf-connecting-ip")?.trim();
  if (cfIp) {
    return cfIp;
  }

  const forwarded = headerList.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) {
    return first;
  }

  return "unknown";
}

export function isLoginRateLimited(key: string, now = Date.now()): boolean {
  const window = failures.get(key);
  if (!window) {
    return false;
  }
  if (now >= window.resetAt) {
    failures.delete(key);
    return false;
  }
  return window.count >= LOGIN_MAX_FAILURES;
}

export function recordFailedLogin(key: string, now = Date.now()): void {
  const window = failures.get(key);
  if (!window || now >= window.resetAt) {
    failures.set(key, { count: 1, resetAt: now + LOGIN_LOCKOUT_MS });
    return;
  }
  window.count += 1;
}

export function clearFailedLogins(key: string): void {
  failures.delete(key);
}

export function resetLoginRateLimits(): void {
  failures.clear();
}

export async function getLoginRateLimiter(): Promise<
  LoginRateLimiter | undefined
> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return asLoginRateLimiter(
      (env as { LOGIN_LIMITER?: unknown }).LOGIN_LIMITER,
    );
  } catch {
    // `next dev` can run without Worker bindings.
    return undefined;
  }
}
