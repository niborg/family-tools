import { describe, expect, it } from "vitest";
import { textFromAnthropicResponse, userFacingReviewError } from "./review";

describe("userFacingReviewError", () => {
  it("maps a missing API key", () => {
    expect(userFacingReviewError(new Error("ANTHROPIC_API_KEY is not set"))).toBe(
      "Reviews aren't configured yet.",
    );
  });

  it("maps rate limits", () => {
    expect(userFacingReviewError(new Error("429 too many requests"))).toBe(
      "The reviewer is busy. Try again in a minute.",
    );
  });

  it("maps timeouts", () => {
    expect(userFacingReviewError(new Error("Anthropic request timed out"))).toBe(
      "The review took too long. Try again.",
    );
  });

  it("hides unexpected details", () => {
    expect(userFacingReviewError(new Error("ECONNRESET"))).toBe(
      "The review did not finish. Try uploading again.",
    );
  });
});

describe("textFromAnthropicResponse", () => {
  it("joins text parts", () => {
    expect(
      textFromAnthropicResponse({
        content: [
          { type: "text", text: "Insured: Acme" },
          { type: "text", text: "Expires next June" },
        ],
      }),
    ).toBe("Insured: Acme\n\nExpires next June");
  });

  it("throws when Anthropic returns an error or no text", () => {
    expect(() =>
      textFromAnthropicResponse({ error: { message: "overloaded_error" } }),
    ).toThrow("overloaded_error");
    expect(() => textFromAnthropicResponse({ content: [] })).toThrow(
      /empty anthropic response/,
    );
  });
});
