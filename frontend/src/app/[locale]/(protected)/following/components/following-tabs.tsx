"use client";

import { Tabs, TabsList, TabsTab } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FollowingTabs() {
  const t = useTranslations("protected.following");
  const tWatchLater = useTranslations("protected.watchLater");
  const tFilters = useTranslations("protected.filters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isWatchLater = pathname.includes("/watch-later");
  const isFavorites = searchParams.get("favorites") === "true";
  const activeTab = isWatchLater
    ? "watchLater"
    : isFavorites
      ? "favorites"
      : "recordings";

  const handleTabChange = (value: string | null) => {
    if (value === "favorites") {
      router.push("/following?favorites=true");
    } else if (value === "watchLater") {
      router.push("/watch-later");
    } else {
      router.push("/following");
    }
  };

  return (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
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
      <TabsList>
        <TabsTab value="recordings">{t("title")}</TabsTab>
        <TabsTab
          value="favorites"
          leftSection={<IconStarFilled size={14} />}
        >
          {tFilters("actions.favorites")}
        </TabsTab>
        <TabsTab value="watchLater">{tWatchLater("title")}</TabsTab>
      </TabsList>
    </Tabs>
  );
}
