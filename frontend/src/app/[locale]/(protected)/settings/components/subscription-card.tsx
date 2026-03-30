"use client";

import { useUser } from "@/app/providers/user-provider";
import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function SubscriptionCard() {
  const user = useUser();
  const t = useTranslations("protected.settings");

  return (
    <Stack gap="xs">
      <Title order={4}>{t("subscription.title")}</Title>
      <Card p="md" radius="md" bg="gray.9">
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="lg">{t("subscription.currentPlan")}</Text>
            <Badge size="xl" variant="light" color="blue">
              {user?.role?.name || "Free"}
            </Badge>
          </Group>
          <Text size="md" c="dimmed">
            {t("subscription.description")}
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
