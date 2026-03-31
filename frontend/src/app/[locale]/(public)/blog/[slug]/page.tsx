import dayjs from "@/app/lib/dayjs";
import { generateAlternates } from "@/app/lib/seo";
import publicApi from "@/lib/public-api";
import { Anchor, Container, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string, locale: string) {
  const response = await publicApi.blog.getBlogs({
    filters: { slug: { $eq: slug } },
    locale: locale,
  });
  return response.data?.data?.[0] || null;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const blog = await getBlog(slug, locale);

  if (!blog) return {};

  return {
    title: blog.title,
    description: blog.short || blog.title,
    alternates: generateAlternates(`/blog/${slug}`, locale),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const blog = await getBlog(slug, locale);

  if (!blog) notFound();

  return (
    <Container size="md" style={{ position: "relative", zIndex: 1 }}>
      <Stack gap={32}>
        <Link
          href="/blog"
          style={{ color: "#52FF94", fontWeight: 500, textDecoration: "none" }}
        >
          <IconArrowLeft
            size={16}
            style={{ verticalAlign: "middle", marginRight: 4 }}
          />
          {t("backToBlog")}
        </Link>

        <Stack gap={12}>
          <Title
            order={1}
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              lineHeight: 1.3,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #54ff5b, #b7ff6b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              paddingBottom: "0.1em",
            }}
          >
            {blog.title}
          </Title>
          <Text size="sm" style={{ color: "#64748b" }}>
            {dayjs(blog.createdAt).format("MMMM D, YYYY")}
          </Text>
        </Stack>

        {blog.content && (
          <div style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <Title order={2} mb="sm" mt="xl" style={{ color: "#f1f5f9" }}>
                    {children}
                  </Title>
                ),
                h3: ({ children }) => (
                  <Title order={3} mb="xs" mt="lg" style={{ color: "#f1f5f9" }}>
                    {children}
                  </Title>
                ),
                p: ({ children }) => (
                  <Text
                    mt="xs"
                    style={{ color: "#94a3b8", lineHeight: 1.8 }}
                  >
                    {children}
                  </Text>
                ),
                a: ({ children, href }) => (
                  <Anchor
                    href={href}
                    style={{ color: "#52FF94" }}
                    target="_blank"
                  >
                    {children}
                  </Anchor>
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        )}
      </Stack>
    </Container>
  );
}
