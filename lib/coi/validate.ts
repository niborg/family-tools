export const MAX_COI_BYTES = 10 * 1024 * 1024;

export type CoiFileValidation =
  | { ok: true; file: File }
  | { ok: false; error: string };

export function validateCoiFile(value: unknown): CoiFileValidation {
  if (!(value instanceof File) || value.size === 0) {
    return { ok: false, error: "Choose a PDF to upload." };
  }

  const isPdf =
    value.type === "application/pdf" || value.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return { ok: false, error: "That needs to be a PDF." };
  }

  if (value.size > MAX_COI_BYTES) {
    return { ok: false, error: "That file is too large. Keep it under 10 MB." };
  }

  return { ok: true, file: value };
}
