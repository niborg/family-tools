import { describe, expect, it } from "vitest";
import {
  canStartReview,
  isReviewId,
  parseCoiMeta,
  toPublicReview,
} from "./types";

describe("isReviewId", () => {
  it("accepts a UUID", () => {
    expect(isReviewId("2c1d6b3a-4f10-4a22-9b80-6d2e1f0a9c11")).toBe(true);
  });

  it("rejects path-like or empty values", () => {
    expect(isReviewId("")).toBe(false);
    expect(isReviewId("../secret")).toBe(false);
    expect(isReviewId("reviews/abc/meta.json")).toBe(false);
    expect(isReviewId("not-a-uuid")).toBe(false);
  });
});

describe("canStartReview", () => {
  it("starts queued or stuck processing reviews", () => {
    expect(canStartReview("queued")).toBe(true);
    expect(canStartReview("processing")).toBe(true);
    expect(canStartReview("done")).toBe(false);
    expect(canStartReview("error")).toBe(false);
  });
});

describe("parseCoiMeta", () => {
  const valid = {
    status: "queued",
    filename: "acme.pdf",
    createdAt: "2026-09-04T00:00:00.000Z",
  };

  it("reads a complete status record", () => {
    expect(
      parseCoiMeta({
        ...valid,
        status: "done",
        result: "Looks fine.",
      }),
    ).toEqual({
      status: "done",
      filename: "acme.pdf",
      createdAt: "2026-09-04T00:00:00.000Z",
      result: "Looks fine.",
    });
  });

  it("keeps an error message on failed reviews", () => {
    expect(
      parseCoiMeta({
        ...valid,
        status: "error",
        error: "The review did not finish. Try uploading again.",
      }),
    ).toMatchObject({
      status: "error",
      error: "The review did not finish. Try uploading again.",
    });
  });

  it("rejects missing or invalid fields", () => {
    expect(parseCoiMeta(null)).toBeNull();
    expect(parseCoiMeta("queued")).toBeNull();
    expect(parseCoiMeta({ ...valid, status: "nope" })).toBeNull();
    expect(parseCoiMeta({ ...valid, filename: "" })).toBeNull();
    expect(parseCoiMeta({ ...valid, createdAt: 1 })).toBeNull();
  });
});

describe("toPublicReview", () => {
  it("exposes only what the wait page needs", () => {
    expect(
      toPublicReview("2c1d6b3a-4f10-4a22-9b80-6d2e1f0a9c11", {
        status: "done",
        filename: "acme.pdf",
        createdAt: "2026-09-04T00:00:00.000Z",
        result: "Looks fine.",
      }),
    ).toEqual({
      id: "2c1d6b3a-4f10-4a22-9b80-6d2e1f0a9c11",
      status: "done",
      filename: "acme.pdf",
      result: "Looks fine.",
    });
  });
});
