import { getCloudflareContext } from "@opennextjs/cloudflare";

export type ImagesHandle = {
  transform(options: { width?: number; height?: number }): ImagesHandle;
  output(options: {
    format: "image/jpeg" | "image/png" | "image/webp" | "image/avif";
    quality?: number;
  }): Promise<{ response(): Response }>;
};

export type ImagesBinding = {
  input(image: ReadableStream<Uint8Array> | ArrayBuffer): ImagesHandle;
};

export function asImagesBinding(value: unknown): ImagesBinding | undefined {
  if (
    value &&
    typeof value === "object" &&
    "input" in value &&
    typeof value.input === "function"
  ) {
    return value as ImagesBinding;
  }
  return undefined;
}

export async function getImagesBinding(): Promise<ImagesBinding> {
  const { env } = await getCloudflareContext({ async: true });
  const images = asImagesBinding((env as { IMAGES?: unknown }).IMAGES);
  if (!images) {
    throw new Error("IMAGES binding is missing");
  }
  return images;
}
