const MAX_EDGE = 2000;
const JPEG_QUALITY = 0.72;

function jpegName(name: string): string {
  const trimmed = name.trim() || "sheet.jpg";
  return trimmed.replace(/\.[^.]+$/, "") + ".jpg";
}

export async function compressPhotoForUpload(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return file;
    }
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
    });
    if (!blob || blob.size === 0) {
      return file;
    }
    if (blob.size >= file.size && file.type === "image/jpeg") {
      return file;
    }
    return new File([blob], jpegName(file.name), { type: "image/jpeg" });
  } catch {
    return file;
  }
}
