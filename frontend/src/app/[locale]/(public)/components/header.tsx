import { Container, Divider, Flex, Group } from "@mantine/core";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { AuthButtons } from "./header-auth";

export async function Header() {
  const t = await getTranslations("footer");

  return (
    <header>
      <Container size="xl" py={12}>
        <Flex justify="space-between" align="center">
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
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              Stream<span style={{ color: "#52FF94" }}>Archive</span>
            </span>
          </Link>

          <Group gap={12}>
            <AuthButtons
              loginLabel={t("header.login")}
              signUpLabel={t("header.signUp")}
              dashboardLabel={t("header.dashboard")}
            />
          </Group>
        </Flex>
      </Container>
      <Divider />
    </header>
  );
}
