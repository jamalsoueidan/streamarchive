import {
  Center,
  SimpleGrid,
  Stack,
  Tabs,
  TabsList,
  TabsTab,
} from "@mantine/core";
import { IconScissors } from "@tabler/icons-react";
import { getLocale, getTranslations } from "next-intl/server";

import PaginationControls from "@/app/components/pagination";
import api from "@/lib/api";
import { EmptyState } from "../components/empty-state";
import { ClipCard } from "./components/clip-card";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const t = await getTranslations("protected.myClips");
  const locale = await getLocale();

  const pageNumber = parseInt(page || "1", 10);
  const limit = 12;

  const response = await api.clip
    .meGetClips({
      populate: {
        follower: {
          populate: { avatar: true },
        },
      },
      "pagination[limit]": limit,
      "pagination[start]": (pageNumber - 1) * limit,
      sort: "createdAt:desc",
      locale,
    })
    .catch(() => null);

  const clips = response?.data?.data;
  const meta = response?.data?.meta;
  const totalPages = meta?.pagination?.pageCount || 1;

  return (
    <Stack w="100%">
      <Tabs
        defaultValue="default"
        styles={{
          list: {
            borderBottomWidth: 4,
          },
          tab: {
            fontSize: "var(--mantine-font-size-lg)",
            fontWeight: 600,
            padding: "var(--mantine-spacing-sm) var(--mantine-spacing-md)",
            borderBottomWidth: 4,
          },
        }}
      >
        <TabsList>
          <TabsTab value="default">{t("title")}</TabsTab>
        </TabsList>
      </Tabs>

      {!clips || clips.length === 0 ? (
        <EmptyState
          title={t("emptyState.title")}
          description={t("emptyState.description")}
          icon={<IconScissors size={90} stroke={2} />}
        />
      ) : (
        <Stack gap="md">
          {totalPages > 1 && (
            <Center>
              <PaginationControls total={totalPages} size="lg" />
            </Center>
          )}
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {clips?.map((clip) => (
              <ClipCard key={clip.documentId} clip={clip} locale={locale} />
            ))}
          </SimpleGrid>
          {totalPages > 1 && (
            <Center>
              <PaginationControls total={totalPages} size="lg" />
            </Center>
          )}
        </Stack>
      )}
    </Stack>
  );
}
