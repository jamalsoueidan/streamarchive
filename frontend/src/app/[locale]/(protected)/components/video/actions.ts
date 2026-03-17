"use server";

import api from "@/lib/api";

export async function getRecordingById(documentId: string) {
  const { data } = await api.recording.getRecordingsId(
    { id: documentId },
    {
      query: {
        populate: {
          follower: {
            populate: { avatar: true },
          },
          sources: true,
        },
      },
    } as never,
  );
  return data?.data ?? null;
}
