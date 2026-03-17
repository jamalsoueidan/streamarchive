"use client";

import { Box, Flex, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { VideoPlayer } from "@/app/[locale]/(protected)/components/video/video-player";
import { getRecordingById } from "@/app/[locale]/(protected)/components/video/actions";

const SHELL_HEIGHT =
  "calc(100dvh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - var(--app-shell-padding) * 2)";

export default function VideoPage() {
  const router = useRouter();
  const params = useParams<{
    id: string;
    username: string;
    type: string;
  }>();

  const { data: recording, isLoading } = useQuery({
    queryKey: ["recording", params.id],
    queryFn: () => getRecordingById(params.id),
  });

  if (isLoading) {
    return (
      <Box h={SHELL_HEIGHT} pos="relative">
        <Flex h="100%" justify="center" align="center">
          <Loader size="lg" />
        </Flex>
      </Box>
    );
  }

  if (!recording) {
    router.replace(`/${params.type}/${decodeURIComponent(params.username)}`);
    return null;
  }

  return (
    <Box
      h={SHELL_HEIGHT}
      pos="relative"
      style={{
        borderRadius: "var(--mantine-radius-md)",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <Flex h="100%" justify="center" align="center">
        <VideoPlayer
          recording={recording}
          defaultMuted={false}
          autoPlay={true}
        />
      </Flex>
    </Box>
  );
}
