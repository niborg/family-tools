import { describe, expect, it } from "vitest";
import { safeInternalPath } from "./paths";

describe("safeInternalPath", () => {
  it("keeps in-app paths and query strings", () => {
    expect(safeInternalPath("/attendance")).toBe("/attendance");
    expect(safeInternalPath("/attendance?week=2026-08-31")).toBe(
      "/attendance?week=2026-08-31",
    );
    expect(safeInternalPath("/coi/abc")).toBe("/coi/abc");
  });

  it("rejects open redirects and login loops", () => {
    expect(safeInternalPath("//evil.example")).toBe("/");
    expect(safeInternalPath("https://evil.example")).toBe("/");
    expect(safeInternalPath("/\\evil")).toBe("/");
    expect(safeInternalPath("/login")).toBe("/");
    expect(safeInternalPath("/login?next=/attendance")).toBe("/");
    expect(safeInternalPath("attendance")).toBe("/");
    expect(safeInternalPath("")).toBe("/");
    expect(safeInternalPath(undefined)).toBe("/");
  });

  it("honors a fallback", () => {
    expect(safeInternalPath("nope", "/attendance")).toBe("/attendance");
  });
});
