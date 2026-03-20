"use client";

import { SearchCreatorModal } from "@/app/[locale]/(protected)/components/search-creator-modal";
import { SegmentedControl, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlayerPlayFilled,
  IconSearch,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { navigation } from "./navbar";

export function MobileBar() {
  const [searchOpened, { open: openSearch, close: closeSearch }] =
    useDisclosure(false);
  const [, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("protected.navigation");

  const iconProps = {
    style: { display: "block" },
    size: 20,
    stroke: 1.5,
  };

  const handleChange = (value: string) => {
    startTransition(() => {
      router.push(value);
    });
  };

  const currentValue = (() => {
    const item = navigation.find((item) =>
      pathname.startsWith(item.url || ""),
    );
    return item?.url || "";
  })();

  const links = navigation
    .filter((item) => item.url !== "/live")
    .map((item) => {
      const Icon = item.icon || IconPlayerPlayFilled;
      return {
        value: item.url,
        label: (
          <Stack gap={2} align="center">
            <Icon
              {...iconProps}
              style={{ width: "18px", height: "18px" }}
              color={item.color ? item.color : undefined}
            />
            <Text c="dimmed" size="xs">
              {t(item.labelKey)}
            </Text>
          </Stack>
        ),
      };
    });

  return (
    <>
      <SearchCreatorModal opened={searchOpened} onClose={closeSearch} />
      <SegmentedControl
        size="xl"
        fullWidth
        value={currentValue}
        onChange={(value) => {
          if (value === "search") {
            openSearch();
            return;
          }
          handleChange(value);
        }}
        styles={{ label: { height: 46, padding: "4px" } }}
        data={[
          ...links,
          {
            value: "search",
            label: (
              <Stack gap={2} align="center">
                <IconSearch
                  {...iconProps}
                  style={{ width: "18px", height: "18px" }}
                />
                <Text c="dimmed" size="xs">
                  {t("actions.search")}
                </Text>
              </Stack>
            ),
          },
        ]}
      />
    </>
  );
}
