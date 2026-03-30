import { Anchor, Stack, Tabs, TabsList, TabsTab } from "@mantine/core";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { getRecordingsByIds } from "./actions";
import { ClearWatchLaterButton } from "./components/clear-watch-later-button";
import WatchLaterList from "./components/watch-later-list";
import { getWatchLaterIds } from "./lib/get-watch-later-ids";

const PAGE_SIZE = 12;

export default async function Page() {
  const t = await getTranslations("protected.watchLater");
  const tFollowing = await getTranslations("protected.following");
  const watchLaterIds = await getWatchLaterIds();
  const idsToFetch = watchLaterIds.slice(0, PAGE_SIZE);

  const queryClient = new QueryClient();

  if (idsToFetch.length > 0) {
    await queryClient.prefetchQuery({
      queryKey: ["watch-later", idsToFetch],
      queryFn: () => getRecordingsByIds(idsToFetch),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack w="100%">
        <Tabs
          value="watchLater"
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
            <TabsTab value="recordings">
              <Anchor href="/following" underline="never" c="inherit">
                {tFollowing("title")}
              </Anchor>
            </TabsTab>
            <TabsTab value="watchLater">{t("title")}</TabsTab>
          </TabsList>
        </Tabs>

        <ClearWatchLaterButton initialCount={watchLaterIds.length} />
        <WatchLaterList initialIds={watchLaterIds} />
      </Stack>
    </HydrationBoundary>
  );
}
