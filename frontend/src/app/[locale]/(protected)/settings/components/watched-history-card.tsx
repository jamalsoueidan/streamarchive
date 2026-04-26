"use client";

import { useWatched } from "@/app/hooks/use-watched";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconEye, IconTrash } from "@tabler/icons-react";

export function WatchedHistoryCard() {
  const { watched, clearWatched } = useWatched();
  const count = watched.length;

  const handleClear = () => {
    modals.openConfirmModal({
      title: "Clear watched history",
      children: (
        <Text size="sm">
          This will remove the WATCHED badge from {count} videos. They&apos;ll
          appear unwatched again. Continue?
        </Text>
      ),
      labels: { confirm: "Clear", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        clearWatched();
        notifications.show({
          title: "Cleared",
          message: "Your watched history has been cleared.",
          color: "green",
        });
      },
    });
  };

  return (
    <Card withBorder p="xl">
      <Stack gap="lg">
        <Group>
          <IconEye size={28} />
          <Title order={2}>Watched videos</Title>
        </Group>

        <Text size="md" c="dimmed">
          You&apos;ve marked {count} videos as watched. This shows up as a
          badge on thumbnails so you can tell at a glance which ones you&apos;ve
          already seen.
        </Text>

        <Button
          size="md"
          variant="outline"
          leftSection={<IconTrash size={18} />}
          onClick={handleClear}
          disabled={count === 0}
        >
          Clear watched history
        </Button>
      </Stack>
    </Card>
  );
}
