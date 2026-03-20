"use client";

import { SearchCreatorModal } from "@/app/[locale]/(protected)/components/search-creator-modal";
import { SegmentedControl, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
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
      const isActive = pathname.startsWith(item.url || "");
      return {
        value: item.url,
        label: (
          <Stack gap={2} align="center">
            <Icon
              stroke={2}
              style={{
                width: "24px",
                height: "24px",
                color: isActive ? "#52FF94" : item.color || undefined,
              }}
            />
            <Text
              size="xs"
              ta="center"
              lh={1.2}
              fw={500}
              c={isActive ? "#52FF94" : "dimmed"}
            >
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
          if (value === "/search") {
            openSearch();
            return;
          }
          handleChange(value);
        }}
        styles={{ label: { height: 46, padding: "4px" } }}
        data={links}
      />
    </>
  );
}
