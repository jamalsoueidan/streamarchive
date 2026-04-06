"use client";

import { Card, Group, Image, Select, SelectProps } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { PLATFORM_OPTIONS } from "../../components/filters-types";
import { useIntlNames } from "../../hooks/use-intl-names";
import { followingParsers, FollowingSortOptions } from "../lib/search-params";

const sortLabelKeys: Record<string, string> = {
  [FollowingSortOptions.updatedAtDesc]: "sort.updatedAtDesc",
  [FollowingSortOptions.updatedAtAsc]: "sort.updatedAtAsc",
};

const dateRangeLabelKeys: Record<string, string> = {
  today: "dateRange.today",
  yesterday: "dateRange.yesterday",
  thisWeek: "dateRange.thisWeek",
  lastWeek: "dateRange.lastWeek",
  thisMonth: "dateRange.thisMonth",
  lastMonth: "dateRange.lastMonth",
};

const FlagIcon = ({ code, size = 20 }: { code: string; size?: number }) => (
  <Image
    src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
    alt={code}
    w={size}
    h={Math.round(size * 0.75)}
    radius={2}
    fit="cover"
  />
);

interface FilterOption {
  value: string;
  label: string;
}

interface FilterOptions {
  genders: FilterOption[];
  types: FilterOption[];
  countryCodes: FilterOption[];
  languageCodes: FilterOption[];
}

interface Props {
  filterOptions?: FilterOptions;
}

export default function Filters({ filterOptions }: Props) {
  const { getCountryName } = useIntlNames();
  const t = useTranslations("protected.filters");
  const [filters, setFilters] = useQueryStates(followingParsers);

  const sortData = Object.values(FollowingSortOptions).map((value) => ({
    value,
    label: t(sortLabelKeys[value]),
  }));

  const platformData = PLATFORM_OPTIONS.map((p) => ({
    value: p.value,
    label: t(`platforms.${p.value}`),
  }));

  const dateRangeData = Object.entries(dateRangeLabelKeys).map(
    ([value, key]) => ({
      value,
      label: t(key),
    }),
  );

  const countryData =
    filterOptions?.countryCodes?.map((c) => ({
      value: c.value,
      label: `${getCountryName(c.value)} (${c.label.match(/\d+/)?.[0] || 0})`,
    })) || [];

  const renderCountryOption: SelectProps["renderOption"] = ({ option }) => (
    <Group gap="sm">
      <FlagIcon code={option.value} size={20} />
      <span>
        {getCountryName(option.value)} ({option.label.match(/\d+/)?.[0]})
      </span>
    </Group>
  );

  return (
    <Card bg="gray.9" radius="md" p="sm" withBorder={false}>
      <Group gap="sm" wrap="wrap">
        <Select
          size="sm"
          placeholder={t("sort.label")}
          value={filters.sort}
          onChange={(value) =>
            setFilters({
              sort:
                (value as FollowingSortOptions) ||
                FollowingSortOptions.updatedAtDesc,
            })
          }
          data={sortData}
          w={150}
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
        <Select
          size="sm"
          placeholder={t("dateRange.label")}
          value={filters.dateRange}
          onChange={(value) => setFilters({ dateRange: value })}
          data={dateRangeData}
          clearable
          w={160}
        />
        {countryData.length > 0 && (
          <Select
            size="sm"
            placeholder={t("country.label")}
            value={filters.country}
            onChange={(value) => setFilters({ country: value })}
            data={countryData}
            renderOption={renderCountryOption}
            clearable
            searchable
            w={200}
          />
        )}
      </Group>
    </Card>
  );
}
