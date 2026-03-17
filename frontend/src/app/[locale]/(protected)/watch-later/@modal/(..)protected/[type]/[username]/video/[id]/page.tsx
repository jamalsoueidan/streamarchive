"use client";

import { VideoModal } from "@/app/[locale]/(protected)/components/video/video-modal";
import { getRecordingById } from "@/app/[locale]/(protected)/components/video/actions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function RecordingModal() {
  const params = useParams<{ id: string }>();

  const { data: recording, isLoading } = useQuery({
    queryKey: ["recording", params.id],
    queryFn: () => getRecordingById(params.id),
  });

  return (
    <VideoModal
      recording={recording}
      isLoading={isLoading}
      fallbackUrl="/watch-later"
    />
  );
}
