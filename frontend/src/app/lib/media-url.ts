export function getImageUrl(
  recordingDocumentId: string,
  file: "preview.jpg" | "screenshot.jpg" | "thumbnails.jpg",
  source?: {
    path?: string | null;
    bucket?: string | null;
  } | null,
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl && source?.path && source?.bucket) {
    const host = new URL(baseUrl).hostname.replace(/^www\./, "");
    return `https://media.${host}/${source.bucket}${source.path}${file}`;
  }
  return `/video/${recordingDocumentId}/${file}`;
}
