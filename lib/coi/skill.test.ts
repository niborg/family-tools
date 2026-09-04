import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadCoiSkill } from "./skill";

describe("loadCoiSkill", () => {
  it("loads the markdown skill file", () => {
    const fromDisk = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../../skills/coi-review/SKILL.md",
      ),
      "utf8",
    ).trim();

    const skill = loadCoiSkill();
    expect(skill).toBe(fromDisk);
    expect(skill).toMatch(/ranch-coi-review/);
    expect(skill).toMatch(/Piuma Rd/);
  });
});
