import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Menu,
  useMatches,
} from "@mantine/core";
import { IconCrown, IconLogout, IconSettings } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { useUser } from "@/app/providers/user-provider";
import * as Sentry from "@sentry/nextjs";

export const Header = () => {
  const tPremium = useTranslations("protected.premium");
  const tNavigation = useTranslations("protected.navigation");
  const user = useUser();
  const isMobile = useMatches({
    base: true,
    sm: false,
  });

  return (
    <Flex justify="space-between" h="100%" align="center">
      <Link
        href="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-logo)",
            fontSize: isMobile ? "1.4rem" : "1.6rem",
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          Stream<span style={{ color: "#52FF94" }}>Archive</span>
        </span>
      </Link>

      <Group gap="xs">
        {isMobile ? (
          <ActionIcon
            component={Link}
            href="/premium"
            variant="outline"
            radius="md"
            size="lg"
            color="white"
          >
            <IconCrown size={18} color="gold" />
          </ActionIcon>
        ) : (
          <Button
            component={Link}
            href="/premium"
            variant="outline"
            radius="md"
            size="sm"
            color="white"
            rightSection={<IconCrown color="gold" />}
          >
            {tPremium("title")}
          </Button>
        )}

        <Menu trigger="click">
          <Menu.Target>
            <Button
              variant="subtle"
              c="white"
              color="gray"
              radius="md"
              size="sm"
              leftSection={<IconSettings size={18} />}
            >
              {user?.username}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              component={Link}
              href="/settings"
              leftSection={<IconSettings size={16} />}
            >
              {tNavigation("actions.settings")}
            </Menu.Item>
            <Menu.Item
              onClick={async () => {
                Sentry.setUser(null);
                await fetch("/api/logout", { method: "POST" });
                window.location.href = "/";
              }}
              leftSection={<IconLogout size={16} />}
            >
              {tNavigation("actions.logout")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Flex>
  );
};
