import dayjs from "@/app/lib/dayjs";
import { generateAlternates } from "@/app/lib/seo";
import publicApi from "@/lib/public-api";
import {
  Container,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArticle } from "@tabler/icons-react";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata() {
  const t = await getTranslations("blog");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/blog", locale),
  };
}

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const locale = await getLocale();

  const response = await publicApi.blog.getBlogs({
    "pagination[limit]": 50,
    sort: "createdAt:desc",
    locale: locale,
  });

  const blogs = response.data?.data || [];

  return (
    <Container size="lg" style={{ position: "relative", zIndex: 1 }}>
      <Stack align="center" gap="md" mb={60}>
        <Title
          order={1}
          ta="center"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.3,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #54ff5b, #b7ff6b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            paddingBottom: "0.1em",
          }}
        >
          {t("title")}
        </Title>
        <Text
          size="xl"
          ta="center"
          maw={600}
          style={{ color: "#94a3b8", lineHeight: 1.7 }}
        >
          {t("subtitle")}
        </Text>
      </Stack>

      {blogs.length === 0 ? (
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Stack align="center" gap="md">
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(100, 116, 139, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
              }}
            >
              <IconArticle size={30} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9" }}>
              {t("empty.title")}
            </Title>
            <Text style={{ color: "#64748b" }}>{t("empty.description")}</Text>
          </Stack>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {blogs.map((blog) => (
            <Link
              key={blog.documentId}
              href={`/blog/${blog.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Paper
                p="lg"
                radius="lg"
                h="100%"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  cursor: "pointer",
                }}
              >
                <Stack gap="sm" justify="space-between" h="100%">
                  <div>
                    <Title order={4} mb="xs" style={{ color: "#f1f5f9" }}>
                      {blog.title}
                    </Title>
                    {blog.short && (
                      <Text
                        size="sm"
                        style={{ color: "#94a3b8", lineHeight: 1.6 }}
                        lineClamp={3}
                      >
                        {blog.short}
                      </Text>
                    )}
                  </div>
                  <Text size="xs" style={{ color: "#64748b" }}>
                    {dayjs(blog.createdAt).fromNow()}
                  </Text>
                </Stack>
              </Paper>
            </Link>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
