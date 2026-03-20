"use client";

import {
  AppShell,
  Card,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconClock,
  IconHome,
  IconLibrary,
  IconPlayerRecordFilled,
  IconScissors,
  IconVideo,
} from "@tabler/icons-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

export const navigation = [
  {
    labelKey: "sections.home",
    url: "/dashboard",
    icon: IconHome,
    color: null,
  },
  {
    labelKey: "links.myList",
    url: "/my-list",
    icon: IconLibrary,
    color: null,
  },
  {
    labelKey: "links.myRecordings",
    url: "/following",
    icon: IconVideo,
    color: null,
  },
  {
    labelKey: "links.myClips",
    url: "/my-clips",
    icon: IconScissors,
    color: null,
  },
  {
    labelKey: "links.watchLater",
    url: "/watch-later",
    icon: IconClock,
    color: null,
  },
  {
    labelKey: "links.live",
    url: "/live",
    icon: IconPlayerRecordFilled,
    color: "red",
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

  const pathname = usePathname();
  const t = useTranslations("protected.navigation");

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
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
    <AppShell.Section grow component={ScrollArea}>
      <Card radius="lg" p="xs" withBorder={false} bg="gray.9" h="100%" w="100%">
        <Stack gap={collapsed ? 4 : 8} align="center">
          {links}
        </Stack>
      </Card>
    </AppShell.Section>
  );
}
