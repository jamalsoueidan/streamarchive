"use client";

import { Role } from "@/app/providers/ability-provider";
import { SimpleGrid, Stack, Tabs } from "@mantine/core";
import { useTranslations } from "next-intl";
import { DangerZoneCard } from "./components/danger-zone-card";
import { ProfileCard } from "./components/profile-card";
import { SubscriptionCard } from "./components/subscription-card";
import { WatchedHistoryCard } from "./components/watched-history-card";

export default function SettingsPage() {
  const t = useTranslations("protected.settings");

  return (
    <Stack w="100%">
      <Tabs
        defaultValue="default"
        styles={{
          list: {
            borderBottomWidth: 4,
          },
          tab: {
            fontSize: "var(--mantine-font-size-lg)",
            fontWeight: 600,
            padding: "var(--mantine-spacing-sm) var(--mantine-spacing-md)",
            borderBottomWidth: 4,
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="default">{t("title")}</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <SimpleGrid cols={{ sm: 1 }} spacing="md">
        <ProfileCard />
        <SubscriptionCard />
        <WatchedHistoryCard />
        <Role is="admin" not>
          <DangerZoneCard />
        </Role>
      </SimpleGrid>
    </Stack>
  );
}
