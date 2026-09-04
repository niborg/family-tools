import { beforeEach, describe, expect, it, vi } from "vitest";

const isAuthenticated = vi.fn();
const writeCoiPdf = vi.fn();
const writeCoiMeta = vi.fn();
const readCoiMeta = vi.fn();
const scheduleBackground = vi.fn();
const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirect(url),
}));

vi.mock("@/lib/auth", () => ({
  isAuthenticated: () => isAuthenticated(),
}));

vi.mock("@/lib/coi/storage", () => ({
  writeCoiPdf: (...args: unknown[]) => writeCoiPdf(...args),
  writeCoiMeta: (...args: unknown[]) => writeCoiMeta(...args),
  readCoiMeta: (...args: unknown[]) => readCoiMeta(...args),
}));

vi.mock("@/lib/r2", () => ({
  scheduleBackground: (...args: unknown[]) => scheduleBackground(...args),
}));

vi.mock("@/lib/coi/review", () => ({
  runCoiReview: vi.fn(),
}));

import { getCoiReview, uploadCoi } from "./coi";

function formWith(file?: File): FormData {
  const data = new FormData();
  if (file) {
    data.set("file", file);
  }
  return data;
}

describe("uploadCoi", () => {
  beforeEach(() => {
    isAuthenticated.mockReset();
    writeCoiPdf.mockReset();
    writeCoiMeta.mockReset();
    scheduleBackground.mockReset();
    redirect.mockClear();
  });

  it("asks the visitor to log in again when the session is gone", async () => {
    isAuthenticated.mockResolvedValue(false);

    await expect(uploadCoi(undefined, formWith())).resolves.toEqual({
      error: "Please log in again.",
    });
    expect(writeCoiPdf).not.toHaveBeenCalled();
  });

  it("rejects a missing file before touching storage", async () => {
    isAuthenticated.mockResolvedValue(true);

    await expect(uploadCoi(undefined, formWith())).resolves.toEqual({
      error: "Choose a PDF to upload.",
    });
    expect(writeCoiPdf).not.toHaveBeenCalled();
  });

  it("stores the PDF and redirects to the wait page", async () => {
    isAuthenticated.mockResolvedValue(true);
    writeCoiPdf.mockResolvedValue(undefined);
    writeCoiMeta.mockResolvedValue(undefined);
    scheduleBackground.mockResolvedValue(undefined);

    const file = new File([new Uint8Array(32)], "acme.pdf", {
      type: "application/pdf",
    });

    await expect(uploadCoi(undefined, formWith(file))).rejects.toThrow(
      /^NEXT_REDIRECT:\/coi\//,
    );
    expect(writeCoiPdf).toHaveBeenCalledOnce();
    expect(writeCoiMeta).toHaveBeenCalledOnce();
    expect(scheduleBackground).toHaveBeenCalledOnce();
    expect(redirect.mock.calls[0][0]).toMatch(
      /^\/coi\/[0-9a-f-]{36}$/i,
    );
  });

  it("returns a friendly error when R2 is missing", async () => {
    isAuthenticated.mockResolvedValue(true);
    writeCoiPdf.mockRejectedValue(new Error("COI_BUCKET binding is missing"));

    const file = new File([new Uint8Array(32)], "acme.pdf", {
      type: "application/pdf",
    });

    await expect(uploadCoi(undefined, formWith(file))).resolves.toEqual({
      error: "Uploads aren't configured yet.",
    });
    expect(redirect).not.toHaveBeenCalled();
  });
});

describe("getCoiReview", () => {
  beforeEach(() => {
    isAuthenticated.mockReset();
    readCoiMeta.mockReset();
    scheduleBackground.mockReset();
  });

  it("marks unknown ids as missing", async () => {
    isAuthenticated.mockResolvedValue(true);

    await expect(getCoiReview("not-a-uuid")).resolves.toEqual({
      ok: false,
      error: "We couldn't find that upload.",
      missing: true,
    });
  });

  it("kicks off a still-queued review", async () => {
    isAuthenticated.mockResolvedValue(true);
    readCoiMeta.mockResolvedValue({
      status: "queued",
      filename: "acme.pdf",
      createdAt: "2026-09-04T00:00:00.000Z",
    });
    scheduleBackground.mockResolvedValue(undefined);

    await expect(
      getCoiReview("2c1d6b3a-4f10-4a22-9b80-6d2e1f0a9c11"),
    ).resolves.toEqual({
      ok: true,
      review: {
        id: "2c1d6b3a-4f10-4a22-9b80-6d2e1f0a9c11",
        status: "queued",
        filename: "acme.pdf",
      },
    });
    expect(scheduleBackground).toHaveBeenCalledOnce();
  });
});
