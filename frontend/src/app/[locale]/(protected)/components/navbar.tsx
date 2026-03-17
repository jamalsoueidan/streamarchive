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
import classes from "./navbar.module.css";

export const navigation = [
  {
    titleKey: "sections.home",
    icon: IconHome,
    links: [
      {
        labelKey: "links.dashboard",
        url: "/dashboard",
        icon: IconHome,
        color: null,
      },
    ],
  },
  {
    titleKey: "sections.studio",
    icon: IconVideo,
    links: [
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
    ],
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

  const allLinks = navigation.flatMap((section) => section.links);

  const links = allLinks.map((item) => {
    const Icon = item.icon || IconPlayerRecordFilled;
    const isActive = pathname.includes(item.url || "");

    const linkContent = (
      <Link
        className={classes.link}
        data-active={isActive || undefined}
        data-collapsed={collapsed || undefined}
        key={item.labelKey}
        href={item.url || "#"}
        onClick={(e) => handleLinkClick(e, item.url || "#")}
      >
        <Icon
          className={classes.linkIcon}
          stroke={2}
          style={{ width: "34px", height: "34px" }}
          color={item.color ? item.color : undefined}
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
