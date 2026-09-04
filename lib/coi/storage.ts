import { getCoiBucket } from "@/lib/r2";
import { parseCoiMeta, type CoiMeta } from "./types";

function pdfKey(id: string): string {
  return `reviews/${id}/original.pdf`;
}

function metaKey(id: string): string {
  return `reviews/${id}/meta.json`;
}

export async function writeCoiPdf(id: string, file: File): Promise<void> {
  const bucket = await getCoiBucket();
  await bucket.put(pdfKey(id), await file.arrayBuffer(), {
    httpMetadata: { contentType: "application/pdf" },
  });
}

export async function readCoiPdf(id: string): Promise<ArrayBuffer | null> {
  const bucket = await getCoiBucket();
  const object = await bucket.get(pdfKey(id));
  return object ? object.arrayBuffer() : null;
}

export async function writeCoiMeta(id: string, meta: CoiMeta): Promise<void> {
  const bucket = await getCoiBucket();
  await bucket.put(metaKey(id), JSON.stringify(meta), {
    httpMetadata: { contentType: "application/json" },
  });
}

export async function readCoiMeta(id: string): Promise<CoiMeta | null> {
  const bucket = await getCoiBucket();
  const object = await bucket.get(metaKey(id));
  if (!object) {
    return null;
  }

  try {
    return parseCoiMeta(JSON.parse(await object.text()));
  } catch {
    return null;
  }
}
