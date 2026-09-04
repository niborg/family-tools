import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_RELATIVE = "../../skills/coi-review/SKILL.md";

export function loadCoiSkill(): string {
  const candidates = [
    join(dirname(fileURLToPath(import.meta.url)), SKILL_RELATIVE),
    join(process.cwd(), "skills/coi-review/SKILL.md"),
  ];

  for (const path of candidates) {
    try {
      const text = readFileSync(path, "utf8").trim();
      if (text) {
        return text;
      }
    } catch {
      // try the next location
    }
  }

  throw new Error("COI review skill file is missing");
}
