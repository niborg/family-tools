import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const cookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore),
  headers: vi.fn(async () => new Headers({ "cf-connecting-ip": "203.0.113.8" })),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirect(url),
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(async () => {
    throw new Error("no worker");
  }),
}));

import { LOGIN_MAX_FAILURES, resetLoginRateLimits } from "@/lib/login-rate-limit";
import { login, logout } from "./auth";

const SECRET = "test-auth-secret";
const PASSWORD = "correct-horse";

function form(password?: string): FormData {
  const data = new FormData();
  if (password !== undefined) {
    data.set("password", password);
  }
  return data;
}

describe("login", () => {
  beforeEach(() => {
    cookieStore.set.mockReset();
    redirect.mockClear();
    resetLoginRateLimits();
    delete process.env.SITE_PASSWORD;
    delete process.env.AUTH_SECRET;
  });

  afterEach(() => {
    delete process.env.SITE_PASSWORD;
    delete process.env.AUTH_SECRET;
  });

  it("fails closed when secrets are missing", async () => {
    await expect(login(undefined, form(PASSWORD))).resolves.toEqual({
      error: "This site isn't configured yet.",
    });
    expect(cookieStore.set).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("rejects a wrong or missing password", async () => {
    process.env.SITE_PASSWORD = PASSWORD;
    process.env.AUTH_SECRET = SECRET;

    await expect(login(undefined, form("nope"))).resolves.toEqual({
      error: "That password didn't work. Try again.",
    });
    await expect(login(undefined, form())).resolves.toEqual({
      error: "That password didn't work. Try again.",
    });
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("sets a session cookie and redirects home", async () => {
    process.env.SITE_PASSWORD = PASSWORD;
    process.env.AUTH_SECRET = SECRET;

    await expect(login(undefined, form(PASSWORD))).rejects.toThrow(
      "NEXT_REDIRECT:/",
    );
    expect(cookieStore.set).toHaveBeenCalledOnce();
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("returns to a safe in-app path after login", async () => {
    process.env.SITE_PASSWORD = PASSWORD;
    process.env.AUTH_SECRET = SECRET;
    const data = form(PASSWORD);
    data.set("next", "/attendance?week=2026-08-31");

    await expect(login(undefined, data)).rejects.toThrow(
      "NEXT_REDIRECT:/attendance?week=2026-08-31",
    );
    expect(redirect).toHaveBeenCalledWith("/attendance?week=2026-08-31");
  });

  it("ignores an external next URL", async () => {
    process.env.SITE_PASSWORD = PASSWORD;
    process.env.AUTH_SECRET = SECRET;
    const data = form(PASSWORD);
    data.set("next", "https://evil.example");

    await expect(login(undefined, data)).rejects.toThrow("NEXT_REDIRECT:/");
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("locks out after too many failed passwords", async () => {
    process.env.SITE_PASSWORD = PASSWORD;
    process.env.AUTH_SECRET = SECRET;

    for (let i = 0; i < LOGIN_MAX_FAILURES; i += 1) {
      await expect(login(undefined, form("nope"))).resolves.toEqual({
        error: "That password didn't work. Try again.",
      });
    }

    await expect(login(undefined, form("nope"))).resolves.toEqual({
      error: "Too many tries. Wait a few minutes.",
    });
    await expect(login(undefined, form(PASSWORD))).resolves.toEqual({
      error: "Too many tries. Wait a few minutes.",
    });
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("clears failures after a correct password", async () => {
    process.env.SITE_PASSWORD = PASSWORD;
    process.env.AUTH_SECRET = SECRET;

    for (let i = 0; i < LOGIN_MAX_FAILURES - 1; i += 1) {
      await login(undefined, form("nope"));
    }

    await expect(login(undefined, form(PASSWORD))).rejects.toThrow(
      "NEXT_REDIRECT:/",
    );

    for (let i = 0; i < LOGIN_MAX_FAILURES; i += 1) {
      await expect(login(undefined, form("nope"))).resolves.toEqual({
        error: "That password didn't work. Try again.",
      });
    }
  });
});

describe("logout", () => {
  beforeEach(() => {
    cookieStore.delete.mockReset();
    redirect.mockClear();
  });

  it("clears the session and returns to login", async () => {
    await expect(logout()).rejects.toThrow("NEXT_REDIRECT:/login");
    expect(cookieStore.delete).toHaveBeenCalledWith("family_session");
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
