"use client";

import { TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { exploreParsers } from "../lib/search-params";

interface FilterOptions {
  genders: { value: string; label: string }[];
  types: { value: string; label: string }[];
  countryCodes: { value: string; label: string }[];
  languageCodes: { value: string; label: string }[];
}

interface Props {
  filterOptions?: FilterOptions;
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

  return (
    <TextInput
      placeholder={t("search.placeholder")}
      size="md"
      leftSection={<IconSearch size={18} />}
      rightSection={
        searchValue ? (
          <IconX
            size={16}
            style={{ cursor: "pointer" }}
            onClick={clearSearch}
          />
        ) : null
      }
      value={searchValue}
      onChange={(e) => handleSearchChange(e.currentTarget.value)}
      w={{ base: "100%", sm: 300 }}
    />
  );
}
