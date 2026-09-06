import { describe, expect, it, vi } from "vitest";
import { asImagesBinding } from "./images";

describe("asImagesBinding", () => {
  it("accepts an object with input()", () => {
    const input = vi.fn();
    expect(asImagesBinding({ input })).toEqual({ input });
    expect(asImagesBinding({})).toBeUndefined();
    expect(asImagesBinding(undefined)).toBeUndefined();
  });
});
