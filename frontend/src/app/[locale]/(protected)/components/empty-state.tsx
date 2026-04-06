import { ActionIcon, Stack, Text, Title } from "@mantine/core";
import { IconCut } from "@tabler/icons-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <Stack align="center" justify="center" py={80} gap="lg">
      <ActionIcon variant="transparent" size={120} radius="xl" color="white">
        {icon || <IconCut size={90} stroke={2} />}
      </ActionIcon>
      <Stack align="center" gap={12}>
        <Title order={2} fw={600}>
          {title}
        </Title>
        <Text size="xl" c="dimmed" maw={450} ta="center">
          {description}
        </Text>
      </Stack>
    </Stack>
  );
}
