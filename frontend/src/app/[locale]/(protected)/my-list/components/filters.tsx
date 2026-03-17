"use client";

import { Card, Group, Select, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { PLATFORM_OPTIONS } from "../../components/filters-types";
import { exploreParsers, SortOptions } from "../lib/search-params";

const sortLabelKeys: Record<string, string> = {
  [SortOptions.UsernameAsc]: "sort.usernameAsc",
  [SortOptions.UsernameDesc]: "sort.usernameDesc",
  [SortOptions.createdAtDesc]: "sort.createdAtDesc",
  [SortOptions.createdAtAsc]: "sort.createdAtAsc",
  [SortOptions.TotalRecordingsDesc]: "sort.totalRecordingsDesc",
  [SortOptions.TotalRecordingsAsc]: "sort.totalRecordingsAsc",
  [SortOptions.LatestRecordingDesc]: "sort.latestRecordingDesc",
  [SortOptions.LatestRecordingAsc]: "sort.latestRecordingAsc",
};

interface Props {
  filterOptions?: unknown;
}

export default function Filters({ filterOptions: _filterOptions }: Props) {
  const t = useTranslations("protected.filters");
  const [filters, setFilters] = useQueryStates(exploreParsers);
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilters({ search: value || null });
  }, 400);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    setFilters({ search: null });
  };

  const sortData = Object.values(SortOptions).map((value) => ({
    value,
    label: t(sortLabelKeys[value]),
  }));

  const platformData = PLATFORM_OPTIONS.map((p) => ({
    value: p.value,
    label: t(`platforms.${p.value}`),
  }));

  return (
    <Card bg="gray.9" radius="md" p="sm" withBorder={false}>
      <Group gap="sm" wrap="wrap">
        <TextInput
          placeholder={t("search.placeholder")}
          size="sm"
          leftSection={<IconSearch size={16} />}
          rightSection={
            searchValue ? (
              <IconX
                size={14}
                style={{ cursor: "pointer" }}
                onClick={clearSearch}
              />
            ) : null
          }
          value={searchValue}
          onChange={(e) => handleSearchChange(e.currentTarget.value)}
          style={{ flex: 1, minWidth: 150 }}
        />
        <Select
          size="sm"
          placeholder={t("sort.label")}
          value={filters.sort}
          onChange={(value) =>
            setFilters({ sort: (value as SortOptions) || SortOptions.createdAtDesc })
          }
          data={sortData}
          w={200}
        />
        <Select
          size="sm"
          placeholder={t("platforms.label")}
          value={filters.type || "all"}
          onChange={(value) =>
            setFilters({ type: value === "all" ? null : value })
          }
          data={platformData}
          clearable={!!filters.type}
          w={150}
        />
      </Group>
    </Card>
  );
}
