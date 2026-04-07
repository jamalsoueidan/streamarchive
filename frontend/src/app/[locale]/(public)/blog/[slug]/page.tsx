import { generateAlternates } from "@/app/lib/seo";
import publicApi from "@/lib/public-api";
import {
  Anchor,
  Container,
  Image,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string, locale: string) {
  const response = await publicApi.blog.getBlogs({
    filters: { slug: { $eq: slug } },
    populate: {
      cover_image: { fields: ["url", "width", "height", "alternativeText"] },
    },
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
    description: blog.excerpt || blog.title,
    keywords: blog.keywords || undefined,
    alternates: generateAlternates(`/blog/${slug}`, locale),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const format = await getFormatter();
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
            {blog.createdAt
              ? format.dateTime(new Date(blog.createdAt), {
                  dateStyle: "long",
                })
              : ""}
          </Text>
        </Stack>

        {blog.cover_image?.url && (
          <Image
            src={blog.cover_image.url}
            alt={blog.cover_image.alternativeText || blog.title || ""}
            radius="lg"
            fit="cover"
            mah={400}
          />
        )}

        {blog.content && (
          <div style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <Title order={1} mb="md" mt="xl" style={{ color: "#f1f5f9" }}>
                    {children}
                  </Title>
                ),
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
                h4: ({ children }) => (
                  <Title order={4} mb="xs" mt="md" style={{ color: "#f1f5f9" }}>
                    {children}
                  </Title>
                ),
                p: ({ children }) => (
                  <Text mt="xs" style={{ color: "#94a3b8", lineHeight: 1.8 }}>
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
                strong: ({ children }) => (
                  <strong style={{ color: "#e2e8f0" }}>{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul style={{ color: "#94a3b8", paddingLeft: 20, marginTop: 8 }}>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol style={{ color: "#94a3b8", paddingLeft: 20, marginTop: 8 }}>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li style={{ marginBottom: 4, lineHeight: 1.7 }}>
                    {children}
                  </li>
                ),
                hr: () => (
                  <hr
                    style={{
                      border: "none",
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                      margin: "32px 0",
                    }}
                  />
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    style={{
                      borderLeft: "3px solid #52FF94",
                      paddingLeft: 16,
                      margin: "16px 0",
                      color: "#94a3b8",
                    }}
                  >
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <Table
                    striped
                    highlightOnHover
                    mt="md"
                    mb="md"
                    style={{
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    {children}
                  </Table>
                ),
                thead: ({ children }) => <TableThead>{children}</TableThead>,
                tbody: ({ children }) => <TableTbody>{children}</TableTbody>,
                tr: ({ children }) => <TableTr>{children}</TableTr>,
                th: ({ children }) => (
                  <TableTh style={{ color: "#e2e8f0" }}>{children}</TableTh>
                ),
                td: ({ children }) => (
                  <TableTd style={{ color: "#94a3b8" }}>{children}</TableTd>
                ),
                code: ({ children }) => (
                  <code
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontSize: "0.9em",
                      color: "#e2e8f0",
                    }}
                  >
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      padding: 16,
                      borderRadius: 8,
                      overflow: "auto",
                      marginTop: 8,
                      marginBottom: 8,
                    }}
                  >
                    {children}
                  </pre>
                ),
                img: ({ src, alt }) => (
                  <Image
                    src={src}
                    alt={alt || ""}
                    radius="md"
                    mt="md"
                    mb="md"
                  />
                ),
              }}
            >
              {blog.content.replace(/\\n/g, "\n")}
            </ReactMarkdown>
          </div>
        )}
      </Stack>
    </Container>
  );
}
