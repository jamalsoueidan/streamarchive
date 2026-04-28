export type VideoAccessResult =
  | { allowed: true }
  | { allowed: false; reason: "sign-in" | "upgrade" | "not-found" };

export async function checkVideoAccess(
  recordingDocumentId: string,
): Promise<VideoAccessResult> {
  try {
    const res = await fetch(`/api/video-access/${recordingDocumentId}`, {
      method: "POST",
      credentials: "same-origin",
    });
    if (res.status === 404) {
      return { allowed: false, reason: "not-found" };
    }
    if (!res.ok) {
      return { allowed: false, reason: "upgrade" };
    }
    return (await res.json()) as VideoAccessResult;
  } catch {
    return { allowed: false, reason: "upgrade" };
  }
}
