export function generateAvatarUrl(url?: string, fullUrl: boolean = false) {
  const filename = url?.split("/").pop();
  return (
    (fullUrl ? process.env.NEXT_PUBLIC_BASE_URL : "") + `/avatar/${filename}`
  );
}
