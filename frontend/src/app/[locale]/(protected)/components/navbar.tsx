"use client";

import {
  Anchor,
  AppShell,
  Card,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCut,
  IconHome,
  IconPlayerPlay,
  IconPlayerRecordFilled,
  IconSearch,
  IconUsersGroup,
} from "@tabler/icons-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";
import { SearchCreatorModal } from "./search-creator-modal";

export const navigation = [
  {
    labelKey: "sections.home",
    url: "/dashboard",
    icon: IconHome,
    color: null,
  },
  {
    labelKey: "links.following",
    url: "/my-list",
    icon: IconUsersGroup,
    color: null,
  },
  {
    labelKey: "links.myRecordings",
    url: "/following",
    icon: IconPlayerPlay,
    color: null,
  },
  {
    labelKey: "links.myClips",
    url: "/my-clips",
    icon: IconCut,
    color: null,
  },
  {
    labelKey: "links.live",
    url: "/live",
    icon: IconPlayerRecordFilled,
    color: "red",
  },
  {
    labelKey: "actions.search",
    url: "/search",
    icon: IconSearch,
    color: null,
  },
];

export function Navbar({
  close,
  opened,
  collapsed,
}: {
  close: () => void;
  opened: boolean;
  collapsed: boolean;
}) {
  const router = useRouter();
  const [searchOpened, { open: openSearch, close: closeSearch }] =
    useDisclosure(false);

  const pathname = usePathname();
  const t = useTranslations("protected.navigation");
  const tFooter = useTranslations("footer");

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    if (url === "/search") {
      e.preventDefault();
      if (opened) close();
      openSearch();
      return;
    }
    if (opened) {
      // only mobile
      e.preventDefault();
      close();
      setTimeout(() => router.push(url), 100);
    }
  };

  const links = navigation.map((item) => {
    const Icon = item.icon || IconPlayerRecordFilled;
    const isActive = pathname.includes(item.url || "");

    const linkContent = (
      <Link
        key={item.labelKey}
        href={item.url || "#"}
        onClick={(e) => handleLinkClick(e, item.url || "#")}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          color: isActive ? "#52FF94" : "white",
          padding: "var(--mantine-spacing-xs)",
          borderRadius: "var(--mantine-radius-sm)",
          fontWeight: 500,
          width: "100%",
          fontSize: "var(--mantine-font-size-sm)",
        }}
      >
        <Icon
          stroke={2}
          style={{
            width: "34px",
            height: "34px",
            color: isActive ? "#52FF94" : item.color || undefined,
          }}
        />
        {!collapsed && (
          <Text size="sm" ta="center" mt={2} lh={1.2}>
            {t(item.labelKey)}
          </Text>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip
          key={item.labelKey}
          label={t(item.labelKey)}
          position="right"
          withArrow
        >
          {linkContent}
        </Tooltip>
      );
    }

    return linkContent;
  });

  return (
    <>
      <SearchCreatorModal opened={searchOpened} onClose={closeSearch} />
      <AppShell.Section component={ScrollArea}>
        <Card
          radius="lg"
          p="xs"
          withBorder={false}
          bg="gray.9"
          w="100%"
        >
          <Stack gap={collapsed ? 4 : 8} align="center">
            {links}
          </Stack>
        </Card>
      </AppShell.Section>

      {!collapsed && (
        <AppShell.Section mt="xs">
          <Stack gap={4} align="center">
            <Anchor href="/contact" size="xs" c="dimmed">
              {tFooter("company.contact")}
            </Anchor>
            <Anchor href="/privacy" size="xs" c="dimmed">
              {tFooter("legal.privacy")}
            </Anchor>
            <Anchor href="/terms" size="xs" c="dimmed">
              {tFooter("legal.terms")}
            </Anchor>
          </Stack>
        </AppShell.Section>
      )}
    </>
  );
}
