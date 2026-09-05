import { afterEach, describe, expect, it, vi } from "vitest";

const getCloudflareContext = vi.fn();

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => getCloudflareContext(),
}));

import {
  LOGIN_LOCKOUT_MS,
  LOGIN_MAX_FAILURES,
  clearFailedLogins,
  getLoginRateLimiter,
  isLoginRateLimited,
  loginClientKey,
  recordFailedLogin,
  resetLoginRateLimits,
} from "./login-rate-limit";

describe("loginClientKey", () => {
  it("prefers the Cloudflare connecting IP", () => {
    const headers = new Headers({
      "cf-connecting-ip": "203.0.113.8",
      "x-forwarded-for": "198.51.100.1, 203.0.113.8",
    });

    expect(loginClientKey(headers)).toBe("203.0.113.8");
  });

  it("falls back to the first forwarded address", () => {
    const headers = new Headers({
      "x-forwarded-for": " 198.51.100.1, 203.0.113.8",
    });

    expect(loginClientKey(headers)).toBe("198.51.100.1");
  });

  it("uses a shared key when the client is unknown", () => {
    expect(loginClientKey(new Headers())).toBe("unknown");
  });
});

describe("failed login windows", () => {
  afterEach(() => {
    resetLoginRateLimits();
  });

  it("allows tries until the failure cap", () => {
    const now = 1_700_000_000_000;

    for (let i = 0; i < LOGIN_MAX_FAILURES; i += 1) {
      expect(isLoginRateLimited("10.0.0.1", now)).toBe(false);
      recordFailedLogin("10.0.0.1", now);
    }

    expect(isLoginRateLimited("10.0.0.1", now)).toBe(true);
  });

  it("does not share a lockout across clients", () => {
    const now = 1_700_000_000_000;
    for (let i = 0; i < LOGIN_MAX_FAILURES; i += 1) {
      recordFailedLogin("10.0.0.1", now);
    }

    expect(isLoginRateLimited("10.0.0.2", now)).toBe(false);
  });

  it("clears the window after a successful login", () => {
    const now = 1_700_000_000_000;
    for (let i = 0; i < LOGIN_MAX_FAILURES; i += 1) {
      recordFailedLogin("10.0.0.1", now);
    }

    clearFailedLogins("10.0.0.1");

    expect(isLoginRateLimited("10.0.0.1", now)).toBe(false);
  });

  it("unlocks after the lockout window", () => {
    const now = 1_700_000_000_000;
    for (let i = 0; i < LOGIN_MAX_FAILURES; i += 1) {
      recordFailedLogin("10.0.0.1", now);
    }

    expect(isLoginRateLimited("10.0.0.1", now + LOGIN_LOCKOUT_MS)).toBe(false);
  });
});

describe("getLoginRateLimiter", () => {
  afterEach(() => {
    getCloudflareContext.mockReset();
  });

  it("returns the Worker binding when present", async () => {
    const limiter = { limit: vi.fn() };
    getCloudflareContext.mockResolvedValue({
      env: { LOGIN_LIMITER: limiter },
    });

    await expect(getLoginRateLimiter()).resolves.toBe(limiter);
  });

  it("is absent in next dev", async () => {
    getCloudflareContext.mockRejectedValue(new Error("no worker"));

    await expect(getLoginRateLimiter()).resolves.toBeUndefined();
  });
});
