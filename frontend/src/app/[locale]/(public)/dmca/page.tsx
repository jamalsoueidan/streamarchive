import { Container, Stack, Text, Title } from "@mantine/core";
import { getLocale, getTranslations } from "next-intl/server";
import { generateAlternates } from "@/app/lib/seo";
import { DMCAForm } from "./components/form";

export async function generateMetadata() {
  const t = await getTranslations("dmca");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/dmca", locale),
  };
}

export default async function DMCAPolicy() {
  const t = await getTranslations("dmca");

  return (
    <Container size="md" style={{ position: "relative", zIndex: 1 }}>
      <Stack gap={32}>
        <Stack align="center" gap={16} mb={48}>
          <Title
            order={1}
            ta="center"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              background:
                "linear-gradient(135deg, #54ff5b, #b7ff6b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("header.title")}
          </Title>
          <Text
            size="xl"
            ta="center"
            maw={600}
            style={{ color: "#94a3b8", lineHeight: 1.7 }}
          >
            {t("header.subtitle")}
          </Text>
        </Stack>

        <DMCAForm />

        <Text size="sm" ta="center" style={{ color: "#64748b" }}>
          {t("footer")}
        </Text>
      </Stack>
    </Container>
  );
}
