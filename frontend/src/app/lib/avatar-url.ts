export function generateAvatarUrl(url?: string, fullUrl: boolean = false) {
  const filename = url?.split("/").pop();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl && filename) {
    const hasThumb =
      filename.endsWith(".png") ||
      filename.endsWith(".jpg") ||
      filename.endsWith(".jpeg");
    const host = new URL(baseUrl).hostname.replace(/^www\./, "");
    return `https://image.${host}/${hasThumb ? "thumbnail_" : ""}${filename}`;
  }
  return (fullUrl ? baseUrl : "") + `/avatar/${filename}`;
}
