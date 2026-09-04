"use server";

import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { runCoiReview } from "@/lib/coi/review";
import { readCoiMeta, writeCoiMeta, writeCoiPdf } from "@/lib/coi/storage";
import {
  isReviewId,
  toPublicReview,
  type CoiReviewPublic,
} from "@/lib/coi/types";
import { validateCoiFile } from "@/lib/coi/validate";
import { scheduleBackground } from "@/lib/r2";

export type UploadCoiState = {
  error: string;
};

export type GetCoiReviewResult =
  | { ok: true; review: CoiReviewPublic }
  | { ok: false; error: string; missing?: boolean };

async function kickOffReview(id: string): Promise<void> {
  await scheduleBackground(runCoiReview(id));
}

export async function uploadCoi(
  _prev: UploadCoiState | undefined,
  formData: FormData,
): Promise<UploadCoiState> {
  if (!(await isAuthenticated())) {
    return { error: "Please log in again." };
  }

  const validation = validateCoiFile(formData.get("file"));
  if (!validation.ok) {
    return { error: validation.error };
  }

  const id = crypto.randomUUID();

  try {
    await writeCoiPdf(id, validation.file);
    await writeCoiMeta(id, {
      status: "queued",
      filename: validation.file.name,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("COI upload failed", error);
    return { error: "Uploads aren't configured yet." };
  }

  await kickOffReview(id);
  redirect(`/coi/${id}`);
}

export async function getCoiReview(id: string): Promise<GetCoiReviewResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, error: "Please log in again." };
  }

  if (!isReviewId(id)) {
    return { ok: false, error: "We couldn't find that upload.", missing: true };
  }

  let meta;
  try {
    meta = await readCoiMeta(id);
  } catch (error) {
    console.error("COI status read failed", error);
    return { ok: false, error: "Uploads aren't configured yet." };
  }

  if (!meta) {
    return { ok: false, error: "We couldn't find that upload.", missing: true };
  }

  if (meta.status === "queued") {
    await kickOffReview(id);
  }

  return { ok: true, review: toPublicReview(id, meta) };
}
