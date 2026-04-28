const PUBLIC_FILES = new Set(["thumbnail.jpg", "preview.mp4"]);

export function getClipUrl(
  documentId: string,
  file: string,
  path?: string | null,
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl && path && PUBLIC_FILES.has(file)) {
    const host = new URL(baseUrl).hostname.replace(/^www\./, "");
    return `https://clip.${host}${path}${documentId}/${file}`;
  }
  return `/clip/${documentId}/${file}`;
}
