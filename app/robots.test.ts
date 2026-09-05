import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("asks every crawler to stay out", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        disallow: "/",
        other: {
          "Content-Signal": "search=no, ai-train=no, ai-input=no",
        },
      },
    });
  });
});
