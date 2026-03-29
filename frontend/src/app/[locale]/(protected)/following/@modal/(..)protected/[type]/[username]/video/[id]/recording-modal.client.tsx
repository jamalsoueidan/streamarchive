"use client";

import { checkVideoAccess } from "@/app/actions/video-access";
import { VideoUpgradeModal } from "@/app/[locale]/(protected)/components/video-upgrade-modal";
import { VideoModal } from "@/app/[locale]/(protected)/components/video/video-modal";
import { getRecordingById } from "@/app/[locale]/(protected)/components/video/actions";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export default function RecordingModalClient() {
  const router = useRouter();
  const params = useParams<{ id: string; username: string; type: string }>();

  const { data: recording, isLoading } = useQuery({
    queryKey: ["recording", params.id],
    queryFn: () => getRecordingById(params.id),
  });

  const { data: access, isLoading: isAccessLoading } = useQuery({
    queryKey: ["video-access", params.id],
    queryFn: () => checkVideoAccess(params.id),
  });

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const accessDenied =
    access && !access.allowed ? (
      <VideoUpgradeModal opened={true} onClose={handleClose} />
    ) : undefined;

  return (
    <VideoModal
      recording={recording}
      isLoading={isLoading || isAccessLoading}
      fallbackUrl={`/${params.type}/${decodeURIComponent(params.username)}`}
      accessDenied={accessDenied}
    />
  );
}
