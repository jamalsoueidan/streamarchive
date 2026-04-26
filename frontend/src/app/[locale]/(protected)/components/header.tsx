import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Menu,
  useMatches,
} from "@mantine/core";
import { IconAwardFilled, IconLogout, IconSettings } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { useUser } from "@/app/providers/user-provider";

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
            radius="lg"
            size="lg"
            color="#52FF94"
            style={{
              background: "rgba(27, 147, 69, 0.15)",
              border: "1px solid rgba(82, 255, 148, 0.3)",
            }}
          >
            <IconAwardFilled size={24} color="gold" />
          </ActionIcon>
        ) : (
          <Button
            component={Link}
            href="/premium"
            variant="outline"
            radius="lg"
            size="sm"
            color="#52FF94"
            style={{
              background: "rgba(27, 147, 69, 0.15)",
              border: "1px solid rgba(82, 255, 148, 0.3)",
            }}
            rightSection={<IconAwardFilled color="gold" />}
          >
            {tPremium("title")}
          </Button>
        )}

        <Menu trigger="click">
          <Menu.Target>
            {isMobile ? (
              <ActionIcon
                variant="filled"
                radius="lg"
                size="lg"
                color="white"
                bg="gray.9"
              >
                <IconSettings size={24} />
              </ActionIcon>
            ) : (
              <Button
                variant="filled"
                c="white"
                color="gray.9"
                radius="lg"
                size="sm"
                leftSection={<IconSettings size={24} />}
              >
                {user?.username}
              </Button>
            )}
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              component={Link}
              href="/settings"
              leftSection={<IconSettings size={24} />}
            >
              {tNavigation("actions.settings")}
            </Menu.Item>
            <Menu.Item
              onClick={async () => {
                await fetch("/api/logout", { method: "POST" });
                window.location.href = "/";
              }}
              leftSection={<IconLogout size={24} />}
            >
              {tNavigation("actions.logout")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Flex>
  );
};
