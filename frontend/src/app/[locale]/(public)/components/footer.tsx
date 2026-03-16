"use client";

import {
  Anchor,
  Container,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { navConfig } from "./nav";

export function Footer() {
  const t = useTranslations("footer");

  const data = [
    {
      title: t("featuredCreators.title"),
      links: navConfig.featuredCreators.map((link) => ({
        label: t(`featuredCreators.${link.key}`),
        link: link.href,
      })),
    },
    {
      title: t("watchRecordings.title"),
      links: navConfig.watchRecordings.map((link) => ({
        label: t(`watchRecordings.${link.key}`),
        link: link.href,
      })),
    },
    {
      title: t("legal.title"),
      links: navConfig.legal.map((link) => ({
        label: t(`legal.${link.key}`),
        link: link.href,
      })),
    },
    {
      title: t("company.title"),
      links: navConfig.company.map((link) => ({
        label: t(`company.${link.key}`),
        link: link.href,
      })),
    },
  ];

  const groups = data.map((group) => (
    <Stack key={group.title} gap="xs">
      <Text fw={500} size="sm" c="dimmed">
        {group.title}
      </Text>
      {group.links.map((link) => (
        <Anchor
          key={link.label}
          component="a"
          href={link.link}
          size="md"
          c="white"
        >
          {link.label}
        </Anchor>
      ))}
    </Stack>
  ));

  return (
    <footer style={{ marginTop: "30px" }}>
      <Image src="/logo2.svg" alt="Logo" maw="100%" mt={30} />
      <Container size="xl" pb="xl">
        <SimpleGrid cols={{ base: 1, sm: 3, md: 5 }} mb="xl">
          <Stack>
            <Anchor component="a" href="/" c="white" underline="never">
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
            </Anchor>
            <Text size="sm" c="dimmed">
              {t("tagline")}
            </Text>
          </Stack>

          {groups}
        </SimpleGrid>

        <Stack mt="xl">
          <Text c="dimmed" size="xs" fw="bold">
            {t("copyright")}
          </Text>
          <Text c="dimmed" size="xs">
            {t("copyright_text")} {t("association")}
          </Text>
        </Stack>
      </Container>
    </footer>
  );
}
