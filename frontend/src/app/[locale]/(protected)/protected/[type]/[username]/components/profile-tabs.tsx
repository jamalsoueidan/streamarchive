"use client";

import { Button, Flex } from "@mantine/core";
import {
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { profileParsers, SortOptions } from "../lib/search-params";

interface ProfileTabsProps {
  type: string;
  username: string;
}

export function ProfileTabs({ type, username }: ProfileTabsProps) {
  const t = useTranslations("protected.common");
  const [filters, setFilters] = useQueryStates(profileParsers);

  const isNewest = filters.sort === SortOptions.createdAtDesc;

  return (
    <Flex justify="flex-start">
      <Button.Group>
        <Button
          variant={isNewest ? "filled" : "default"}
          color={isNewest ? "teal" : undefined}
          size="sm"
          leftSection={<IconSortDescending size={18} />}
          onClick={() => setFilters({ sort: SortOptions.createdAtDesc })}
        >
          {t("newest")}
        </Button>
        <Button
          variant={!isNewest ? "filled" : "default"}
          color={!isNewest ? "teal" : undefined}
          size="sm"
          leftSection={<IconSortAscending size={18} />}
          onClick={() => setFilters({ sort: SortOptions.createdAtAsc })}
        >
          {t("oldest")}
        </Button>
      </Button.Group>
    </Flex>
  );
}
