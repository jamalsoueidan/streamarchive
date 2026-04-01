"use client";

import { Tabs, TabsList, TabsTab } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { exploreParsers } from "../lib/search-params";

interface MyListTabsProps {
  count: number;
}

export function MyListTabs({ count }: MyListTabsProps) {
  const t = useTranslations("protected.myList");
  const [filters, setFilters] = useQueryStates(exploreParsers);

  return (
    <Tabs
      value={filters.favorites ? "favorites" : "all"}
      onChange={(value) => setFilters({ favorites: value === "favorites" })}
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
        <TabsTab value="all">{t("title", { count })}</TabsTab>
        <TabsTab
          value="favorites"
          leftSection={<IconStarFilled size={18} color="#fbbf24" />}
        >
          {t("favorites")}
        </TabsTab>
      </TabsList>
    </Tabs>
  );
}
