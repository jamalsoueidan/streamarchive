"use client";

import { Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import { SearchCreator } from "../../components/search-creator";

export function DashboardHero() {
  const t = useTranslations("protected.dashboard");

  return (
    <Stack align="center" gap="md" py="xl">
      <div>
        <Title
          order={1}
          ta="center"
          style={{
            fontSize: "clamp(1rem, 6vw, 1.4rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(27, 147, 69, 0.15)",
              border: "1px solid rgba(82, 255, 148, 0.3)",
              borderRadius: 20,
              padding: "4px 16px",
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              color: "#52FF94",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#ff4444",
                boxShadow: "0 0 6px #ff4444",
                animation: "pulse 2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            {t("heroTitle")}
          </span>
        </Title>
        <Title
          order={2}
          ta="center"
          style={{
            fontSize: "clamp(2.2rem, 6vw, 4.4rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #54ff5b, #b7ff6b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("heroSubtitle")}
        </Title>
      </div>

      <Text
        size="xl"
        ta="center"
        maw={800}
        style={{
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          lineHeight: 1.7,
          color: "#94a3b8",
        }}
      >
        {t("heroDescription")}
      </Text>

      <div style={{ width: "100%", maxWidth: 600 }}>
        <SearchCreator />
      </div>
    </Stack>
  );
}
